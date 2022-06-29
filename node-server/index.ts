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

io.on("connection", (socket) => {
    socket.on("disconnect", () => { console.log("user disconnected") });

    // own

    socket.on("get_page", async (pageName: string, callback) => {
        if (pageName != null) {
            console.log('client wants page, client data: ' + pageName);
            const { body } = await getPage(pageName);
            callback({
                body: {
                    pageName: pageName,
                    pageBody: body
                }
            });
        } else {
            console.log("Empty page name");
        }
    });

    socket.on("update_page", async (pageName, newPageBody) => {
        console.log("client updated, client data: " + pageName + ", " + newPageBody)

        await upsertPage(pageName, newPageBody);
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