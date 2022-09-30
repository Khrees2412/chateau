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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromRoom = exports.addUserToRoom = exports.updateRoom = exports.deleteRoom = exports.getSocketRoomMembers = exports.getRoomMembers = exports.getRoom = exports.createRoom = void 0;
const client_1 = require("@prisma/client");
const misc_1 = require("../misc");
const prisma = new client_1.PrismaClient();
const getRoom = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield prisma.room.findFirst({
            where: {
                name,
            },
        });
        if (!room) {
            return new Error("Room not found!");
        }
        return room;
    }
    catch (error) {
        return new Error(error);
    }
});
exports.getRoom = getRoom;
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, description } = req.body;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    let userId;
    if (res.locals.userId) {
        userId = res.locals;
    }
    try {
        const user = yield prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (user) {
            const room = yield prisma.room.create({
                data: {
                    name,
                    description,
                    avatar: image ? image : "",
                    messageCount: 0,
                    admin: user.username,
                    users: {
                        create: user,
                    },
                },
            });
            res.json((0, misc_1.ComputeResponse)(true, "Room Created", room.name));
        }
        else {
            res.json((0, misc_1.ComputeResponse)(false, "Unable to find user"));
        }
    }
    catch (error) {
        res.json((0, misc_1.ComputeResponse)(false, "Error occurred", error));
    }
});
exports.createRoom = createRoom;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.room.delete({
            where: {
                id,
            },
        });
        res.json((0, misc_1.ComputeResponse)(true, "Room Deleted"));
    }
    catch (error) {
        res.json((0, misc_1.ComputeResponse)(false, "Unable to delete room", error));
    }
});
exports.deleteRoom = deleteRoom;
const updateRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    const { name, description } = req.body;
    const avatar = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
    const updateBody = {};
    if (name) {
        updateBody.name = name;
    }
    if (description) {
        updateBody.description = description;
    }
    if (avatar) {
        updateBody.avatar = avatar;
    }
    try {
        const room = yield prisma.room.update({
            where: {
                id,
            },
            data: updateBody,
        });
        res.json((0, misc_1.ComputeResponse)(true, "Room Updated", room.name));
    }
    catch (error) { }
});
exports.updateRoom = updateRoom;
const getRoomMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { room } = req.query;
    try {
        const members = yield prisma.room.findFirst({
            include: {
                users: true,
            },
            where: {
                name: String(room),
            },
        });
        res.json((0, misc_1.ComputeResponse)(true, "Members returned", members));
    }
    catch (error) {
        res.json((0, misc_1.ComputeResponse)(false, "Error occurred", error));
    }
});
exports.getRoomMembers = getRoomMembers;
const getSocketRoomMembers = (room) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const members = yield prisma.room.findFirst({
            include: {
                users: true,
            },
            where: {
                name: String(room),
            },
        });
        return members;
    }
    catch (error) {
        return new Error(error);
    }
});
exports.getSocketRoomMembers = getSocketRoomMembers;
const addUserToRoom = (user, room) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.room.update({
            where: {
                name: room.name,
            },
            data: {
                users: {
                    create: user,
                },
            },
        });
        return "Added user to room";
    }
    catch (error) {
        return new Error(error);
    }
});
exports.addUserToRoom = addUserToRoom;
const removeUserFromRoom = (user, room) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.room.update({
            where: {
                name: room,
            },
            data: {
                users: {
                    delete: user,
                },
            },
        });
        return "Removed user from room";
    }
    catch (error) {
        return new Error(error);
    }
});
exports.removeUserFromRoom = removeUserFromRoom;
