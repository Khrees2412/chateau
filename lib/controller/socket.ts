import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import logger from "../utils/logger";

import { sendMessage } from "./message";
import { getRoom, removeUserFromRoom } from "./room";

const prisma = new PrismaClient();

const connection = (io: Server) => {
    logger.info("CONNECTED TO IO");
    io.on("connect", (socket) => {
        logger.info("user connected to socket");
        socket.on("joinRoom", async ({ userId, room }) => {
            logger.info(`${userId} in ${room}`);

            // const findRoom = getRoom(room);
            // if (!findRoom) {
            //     socket.disconnect();
            // }
            // const user = await prisma.user.findFirst({
            //     where: {
            //         id: userId,
            //     },
            // });
            // await prisma.user.update({
            //     where: {
            //         id: userId,
            //     },
            //     data: {
            //         rooms: {
            //             create: room,
            //         },
            //     },
            // });
            socket.join(room);

            socket
                .to(room)
                .emit("roomMessage", `${userId} has joined the room`);
        });
        socket.on(
            "sendMessage",
            async ({ message, userId, room }) => {
                //     const user = await prisma.user.findFirst({
                //         where: {
                //             id: userId,
                //         },
                //     });
                //     if (user) {
                //         await createMessage(message, room, user.id);

                io.to(room).emit("sendMessage", message);
            }
            // }
        );
        socket.on("leaveRoom", async ({ userId, room }, callback) => {
            const user = await prisma.user.findFirst({
                where: {
                    id: userId,
                },
            });
            if (user) {
                await removeUserFromRoom(user, room);
                socket.leave(room);

                socket.broadcast
                    .to(room)
                    .emit("roomMessage", `${user.username} has left the room`);
                callback();
            }
        });
        socket.on("disconnect", async (userId: string) => {
            const user = await prisma.user.findFirst({
                where: {
                    id: userId,
                },
            });

            // if (user) {
            //     io.sockets.to(user.room).emit("message", {
            //         user: "Admin",
            //         text: `${user.name} has left.`,
            //     });
            //     io.sockets.to(user.room).emit("roomData", {
            //         room: user.room,
            //         users: getUsersInRoom(user.room),
            //     });
            // }
        });
    });
    io.on("disconnect", async () => {});
};

export default connection;
