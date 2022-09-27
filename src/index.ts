import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import {
    HTTPStatusCode,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} from "./misc";
import { createServer } from "http";
import { Server } from "socket.io";
import connection from "./controllers/socket";

const app: Application = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    },
    transports: ["polling", "websocket"],
});

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connection(io);

app.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(HTTPStatusCode.OK).send({
        message: "Chateau Up and Running!!",
    });
});

const port = process.env.PORT || 5001;
httpServer.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
});

export default app;
