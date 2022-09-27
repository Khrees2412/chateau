import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

import {
    HTTPStatusCode,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} from "../misc";
import { getRoom } from "./room";

const prisma = new PrismaClient();

const connection = (io: Server) => {
    io.sockets.on("connect", (socket) => {
        socket.on("join-room", async ({ userId, room }) => {
            const findRoom = getRoom(room);
            if (!findRoom) {
                socket.disconnect();
            }
            const user = await prisma.user.findFirst({
                where: {
                    id: userId,
                },
            });
            await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    rooms: {
                        create: room,
                    },
                },
            });
            socket.join(room);

            io.sockets
                .in(room)
                .emit("joined-room", `${user?.username} has joined the room`);

            socket.on("sendMessage", (message, callback) => {
                const user = getUser(socket.id);

                io.sockets.to(user.room).emit("message", {
                    user: user.name,
                    text: message,
                });

                callback();
            });
        });

        socket.on("disconnect", () => {
            const user = removeUser(socket.id);

            if (user) {
                io.sockets.to(user.room).emit("message", {
                    user: "Admin",
                    text: `${user.name} has left.`,
                });
                io.sockets.to(user.room).emit("roomData", {
                    room: user.room,
                    users: getUsersInRoom(user.room),
                });
            }
        });
    });
};

export default connection;
