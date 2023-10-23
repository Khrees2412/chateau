import { Server } from "socket.io";
import logger from "./utils/logger";
import RoomService from "./service/room"
import MessageService from "./service/message";
import {MessageType} from "./utils/misc";

declare type ContentType = string | File
interface sendMessageDTO {
    content: ContentType
    roomId: string
    senderId: string
    messageType: string
}

const roomService = new RoomService()
const messageService = new MessageService()

const connection = (io: Server) => {
    logger.info("CONNECTED TO IO");
    io.on("connect", (socket) => {
        logger.info("user connected to socket");
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
            io.emit('chat message', msg);
        });

        socket.on("joinRoom", async ({ userId, roomId }) => {
            await roomService.addUserToRoom(userId, roomId, socket)
            socket
                .to(roomId)
                .emit("roomMessage", `${userId} has joined the room`);
            logger.info(`${userId} joins ${roomId}`);
        });

        socket.on(
            "sendMessage",
            async ({ message, userId, roomId }) => {
                io.to(roomId).emit("sendMessage", message);
                await messageService.createMessage({
                    content: message,
                    senderId: userId,
                    roomId: roomId,
                    messageType: MessageType.text

                })
            }
        );
        socket.on("leaveRoom", async ({ userId, roomId }, callback) => {
        });
        socket.on("disconnect", async (userId: string) => {
            ;
        });
    });
    io.on("disconnect", async () => {});
};

export default connection;

