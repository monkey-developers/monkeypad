import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { getAllPages, getPage, upsertPage } from './prisma/page';
import bodyParser, { BodyParser } from 'body-parser'
import http from 'http'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', "true");

    // Pass to next layer of middleware
    next();
});

// data
interface Page {
    name: string,
    body: string,
    users: number
}

let temporaryDatabase: Page[] = [];

const getTemporaryPage = async (pageName: string) => {
    let temporaryPage = temporaryDatabase.find(page => page.name === pageName)
    if (!temporaryPage) {
        const dbPage = await getPage(pageName);
        console.log("[database][data]: Database Page: " + dbPage);

        if (dbPage != null) {
            temporaryPage = { name: dbPage.name, body: dbPage.body, users: 0 };
        } else {
            temporaryPage = { name: pageName, body: "", users: 0 };
        }

        temporaryDatabase.push(temporaryPage);
        console.log("[server][data]: Created a new page in RAM")
    }
    console.log("[server][data]: Find page, page: ", temporaryPage)
    return temporaryPage;
}

const updateTemporaryPage = (pageName: string, newPageBody: string) => {
    const pageIndex = temporaryDatabase.findIndex(page => page.name === pageName)
    temporaryDatabase[pageIndex].body = newPageBody
    return temporaryDatabase.find(page => page.name === pageName);
}

const updateTemporaryPageCount = (pageName: string, change: number) => {
    const pageIndex = temporaryDatabase.findIndex(page => page.name === pageName)
    temporaryDatabase[pageIndex].users += change
    return temporaryDatabase[pageIndex].users
}

const clearTemporaryPage = async (pageName: string) => {
    console.log("[server][data]:" + temporaryDatabase)

    const page = temporaryDatabase.find(page => page.name === pageName);

    if (page?.body != null) {
        const upsertedPage = await upsertPage(pageName, page.body);
        console.log("[database][data]: upsert page: " + upsertedPage);
        const pageIndex = temporaryDatabase.findIndex(page => page.name === pageName);

        if (pageIndex != null) {
            temporaryDatabase.splice(pageIndex, 1);
        } else { console.log("No item in array") }
    } else {
        console.log("[server][data] failed to save data because body is null");
    }
}

io.on("connection", (socket) => {
    console.log("[server][socket]: user connected, id: " + socket.id);
    let temporaryPageName = "";
    let initialConnection = true;
    // on disconnect
    socket.on("disconnect", async () => {
        console.log("[server][socket]: user disconnected")
        const countUsers = updateTemporaryPageCount(temporaryPageName, -1);
        console.log("[server][data]: user count on " + temporaryPageName + ", " + countUsers);
        if (countUsers < 1) {
            await clearTemporaryPage(temporaryPageName);
            console.log(`[server][data]: page ${temporaryPageName} deleted from array`);
        } else {
            socket.broadcast.emit("page_updated");
        }
    });

    socket.on("get_page", async (pageName: string, callback) => {
        if (pageName != null) {
            console.log('[client]: user GET: ' + pageName);
            let page = await getTemporaryPage(pageName);
            if (initialConnection) {
                temporaryPageName = pageName
                updateTemporaryPageCount(temporaryPageName, 1);
                initialConnection = false;
                page = await getTemporaryPage(pageName);
                socket.broadcast.emit("page_updated");
            }
            callback({
                body: {
                    pageName: pageName,
                    pageBody: page?.body,
                    pageUser: page.users,
                }
            });
        } else {
            console.log("[server]: No page with the name " + pageName);
        }
    });

    socket.on("update_page", (pageName, newPageBody) => {
        console.log("[client]: user update, new data: page: " + pageName + ", body: " + newPageBody)
        const page = updateTemporaryPage(pageName, newPageBody);
        console.log(page)
        socket.broadcast.emit("page_updated");
    });

});


app.get('/', async (req: Request, res: Response) => {
    const pages = await getAllPages();
    res.send(pages);
});

app.get("/:page", async (req: Request, res: Response) => {
    const name = req.params.page;
    const page = await getPage(name);
    res.send(page)
})

app.post('/:page', async (req: Request, res: Response) => {
    const name = req.params.page;
    let body = "";

    if (Object.getOwnPropertyNames(req.body).includes("body")) {
        body = req.body.body;
    }

    const page = await upsertPage(name, body);
    res.send(page);
})

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});