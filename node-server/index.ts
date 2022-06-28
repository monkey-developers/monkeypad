import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
// import { Server } from 'socket.io'
import { getAllPages, getPage, upsertPage } from './prisma/page';
import bodyParser, { BodyParser } from 'body-parser'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

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

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});