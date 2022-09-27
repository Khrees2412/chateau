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

const app: Application = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    /* options */
});

io.on("connect", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit("message", {
            user: "admin",
            text: `${user.name}, welcome to room ${user.room}.`,
        });
        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            text: `${user.name} has joined!`,
        });

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message", { user: user.name, text: message });

        callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", {
                user: "Admin",
                text: `${user.name} has left.`,
            });
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });
});

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(HTTPStatusCode.OK).send({
        message: "Hello World!!",
    });
});

const port = process.env.PORT || 5001;
httpServer.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
});

export default app;
