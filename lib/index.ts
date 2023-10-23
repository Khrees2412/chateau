import express, {Application, Request, Response} from "express";
import http from "http"
import dotenv from "dotenv";
import {HTTPStatusCode} from "./utils/misc";
import roomRouter from "./routes/room";
import logger from "./utils/logger";
import path from "path";
import authRouter from "./routes/auth";
import morganMiddleware from "./middleware/morgan";
import startMetricsCollection from "./middleware/metrics";
import SocketIO from "socket.io";
import connection from "./socket";

const app: Application = express();
const dev = process.env.NODE_ENV !== "production";

const io = require("socket.io")(http, {
    cors: {
        origin: "*:*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    },
    cookie: {
        name: "chateau-socket-cookie",
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
        domain: dev ? "localhost" : "chateau-r0dz.onrender.com",
        secure: dev ? false : true,
    },
    transports: ["polling", "websocket"],
});
connection(io);
startMetricsCollection(app)

dotenv.config();

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get("/room", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/home.html"));
});

app.use("/v1/rooms", roomRouter);
app.use("/v1/auth", authRouter);

app.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(HTTPStatusCode.OK).send({
        message: "Chateau Up and Running!!",
    });
});


const port = process.env.PORT || 5001;
app.listen(port, (): void => {
    logger.info(`Connected successfully on port ${port}`);
});

// Graceful shutdown