import {collectDefaultMetrics, Histogram, register} from "prom-client";
import {Application, Request, Response} from "express";
import {HTTPStatusCode} from "../utils/misc";


const startMetricsCollection = (app: Application) => {
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

    register.setDefaultLabels({
        app: "chateau-realtime-chat",
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
}


export default startMetricsCollection