import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { HTTPStatusCode } from "./misc";
import { createServer } from "http";
import { Server } from "socket.io";
import * as Prometheus from "prom-client";
import connection from "./controllers/socket";
import roomRouter from "./routes/room";
import morganMiddleware from "./middlewares/morgan";

const app: Application = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    },
    transports: ["polling", "websocket"],
});

dotenv.config();

const register = new Prometheus.Registry();

register.setDefaultLabels({
    app: "chateau-realtime-chat",
});

Prometheus.collectDefaultMetrics({
    prefix: "node_",
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register,
});

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
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

connection(io);

app.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(HTTPStatusCode.OK).send({
        message: "Chateau Up and Running!!",
    });
});

app.get("/metrics", (req, res) => {
    res.set("Content-Type", Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
});

// Runs after each requests
app.use((req: Request, res: Response, next) => {
    const responseTimeInMs = Date.now() - res.locals.startEpoch;

    httpRequestDurationMicroseconds
        .labels(req.method, req.route.path, String(res.statusCode))
        .observe(responseTimeInMs);

    next();
});

const port = process.env.PORT || 5001;
httpServer.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
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
