import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import {HTTPStatusCode} from "./misc";
import { createServer } from "http";
import { Server } from "socket.io";


const app: Application = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on(
    "join", () => {}
)

dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(HTTPStatusCode.OK).send({
        message: "Hello World!!",
    });
});

const port = process.env.PORT || 5001
httpServer.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
});

export default app;