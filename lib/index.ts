import express, {Application, Request, Response} from "express";
import dotenv from "dotenv";
import {HTTPStatusCode} from "./utils/misc";
import roomRouter from "./routes/room";
import logger from "./utils/logger";
import path from "path";
import authRouter from "./routes/auth";
import {createServer} from "http";
import morganMiddleware from "./middleware/morgan";
import startSocketConn from "./server";
import startMetricsCollection from "./middleware/metrics";

const app: Application = express();
startSocketConn(app)
startMetricsCollection(app)
const httpServer = createServer(app);

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
httpServer.listen(port, (): void => {
    logger.info(`Connected successfully on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    httpServer.close((err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        process.exit(0);
    });
});