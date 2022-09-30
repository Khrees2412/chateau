"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const misc_1 = require("./misc");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const prom_client_1 = require("prom-client");
const socket_1 = __importDefault(require("./controllers/socket"));
const room_1 = __importDefault(require("./routes/room"));
const morgan_1 = __importDefault(require("./middlewares/morgan"));
const logger_1 = __importDefault(require("./logger"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const dev = process.env.NODE_ENV !== "production";
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    },
    cookie: {
        name: "chateau-socket-cookie",
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        domain: dev ? "localhost" : "chateau-r0dz.onrender.com",
        secure: dev ? false : true,
    },
    transports: ["polling", "websocket"],
});
dotenv_1.default.config();
prom_client_1.register.setDefaultLabels({
    app: "chateau-realtime-chat",
});
app.get("/room", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname + "/client/index.html"));
});
(0, prom_client_1.collectDefaultMetrics)({
    prefix: "node_",
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register: prom_client_1.register,
});
const httpRequestDurationMicroseconds = new prom_client_1.Histogram({
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
app.use(morgan_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/v1/rooms", room_1.default);
(0, socket_1.default)(io);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(misc_1.HTTPStatusCode.OK).send({
        message: "Chateau Up and Running!!",
    });
}));
app.get("/metrics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.set("Content-Type", prom_client_1.register.contentType);
        res.end(yield prom_client_1.register.metrics());
    }
    catch (error) {
        res.status(misc_1.HTTPStatusCode.SERVER_ERROR).end(error);
    }
}));
// Runs after each requests
app.use((req, res, next) => {
    const responseTimeInMs = Date.now() - res.locals.startEpoch;
    httpRequestDurationMicroseconds
        .labels(req.method, req.route.path, String(res.statusCode))
        .observe(responseTimeInMs);
    next();
});
const port = process.env.PORT || 5001;
httpServer.listen(port, () => {
    logger_1.default.info(`Connected successfully on port ${port}`);
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
exports.default = app;
