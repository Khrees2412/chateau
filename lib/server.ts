import {createServer} from "http";
import {Server} from "socket.io";
import connection from "./socket";
import {Application} from "express";


const startSocketConn = (app: Application) => {
    const dev = process.env.NODE_ENV !== "production";

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
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
}


export default startSocketConn