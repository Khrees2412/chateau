import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

import {
    HTTPStatusCode,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} from "../misc";

const prisma = new PrismaClient();

const connection = (io: Server) => {
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

            io.to(user.room).emit("message", {
                user: user.name,
                text: message,
            });

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
};

export default connection;
