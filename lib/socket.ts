import { Server } from "socket.io";
import logger from "./utils/logger";

const connection = (io: Server) => {
    logger.info("CONNECTED TO IO");
    io.on("connect", (socket) => {
        logger.info("user connected to socket");
        socket.on("joinRoom", async ({ userId, room }) => {
            logger.info(`${userId} in ${room}`);
            socket.join(room);
            socket
                .to(room)
                .emit("roomMessage", `${userId} has joined the room`);
        });
        socket.on(
            "sendMessage",
            async ({ message, userId, room }) => {
                io.to(room).emit("sendMessage", message);
            }
        );
        socket.on("leaveRoom", async ({ userId, room }, callback) => {
        });
        socket.on("disconnect", async (userId: string) => {
            ;
        });
    });
    io.on("disconnect", async () => {});
};

export default connection;
