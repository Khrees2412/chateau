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
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../logger"));
const room_1 = require("./room");
const prisma = new client_1.PrismaClient();
const connection = (io) => {
    logger_1.default.info("CONNECTED TO IO");
    io.on("connect", (socket) => {
        logger_1.default.info("user connected to socket");
        socket.on("joinRoom", ({ userId, room }) => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.default.info(`${userId} in ${room}`);
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
        }));
        socket.on("sendMessage", ({ message, userId, room }) => __awaiter(void 0, void 0, void 0, function* () {
            //     const user = await prisma.user.findFirst({
            //         where: {
            //             id: userId,
            //         },
            //     });
            //     if (user) {
            //         await addMessage(message, room, user.id);
            io.to(room).emit("sendMessage", message);
        })
        // }
        );
        socket.on("leaveRoom", ({ userId, room }, callback) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({
                where: {
                    id: userId,
                },
            });
            if (user) {
                yield (0, room_1.removeUserFromRoom)(user, room);
                socket.leave(room);
                socket.broadcast
                    .to(room)
                    .emit("roomMessage", `${user.username} has left the room`);
                callback();
            }
        }));
        socket.on("disconnect", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({
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
        }));
    });
    io.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () { }));
};
exports.default = connection;
