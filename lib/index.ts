import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { HTTPStatusCode } from "./utils/misc";
import { createServer } from "http";
import { Server } from "socket.io";
import { collectDefaultMetrics, register, Histogram } from "prom-client";
import connection from "./socket";
import roomRouter from "./routes/room";
import morganMiddleware from "./middleware/morgan";
import logger from "./utils/logger";
import path from "path";
import authRouter from "./routes/auth";

const app: Application = express();
const dev = process.env.NODE_ENV !== "production";

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
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

dotenv.config();

register.setDefaultLabels({
    app: "chateau-realtime-chat",
});

app.get("/room", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/home.html"));
});

collectDefaultMetrics({
    prefix: "node_",
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register,
});

const httpRequestDurationMicroseconds = new Histogram({
    name: "http_request_duration_ms",
    help: "Duration of HTTP requests in ms",
    labelNames: ["method", "route", "code"],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});

// Runs before each requests
app.use((req, res, next) => {
    res.locals.startEpoch = Date.now();
    next();
});

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/v1/rooms", roomRouter);
app.use("/v1/auth", authRouter);

connection(io);

app.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(HTTPStatusCode.OK).send({
        message: "Chateau Up and Running!!",
    });
});

app.get("/metrics", async (req: Request, res: Response) => {
    try {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        res.status(HTTPStatusCode.SERVER_ERROR).end(error);
    }
});

// Runs after each requests
app.use((req: Request, res: Response, next) => {
    const responseTimeInMs = Date.now() - res.locals.startEpoch;

    httpRequestDurationMicroseconds
        .labels(req.method, "/", String(res.statusCode))
        .observe(responseTimeInMs);

    next();
});

const port = process.env.PORT || 5001;
httpServer.listen(port, (): void => {
    logger.info(`Connected successfully on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    //   clearInterval(metricsInterval)

    httpServer.close((err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        process.exit(0);
    });
});

export default app;
