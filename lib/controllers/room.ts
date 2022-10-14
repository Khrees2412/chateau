import { PrismaClient, Room, User } from "@prisma/client";
import { Request, Response } from "express";
import logger from "../logger";
import { CustomRequest } from "../middlewares/auth";
import { ComputeResponse, HTTPStatusCode } from "../misc";

const prisma = new PrismaClient();

const getRoom = async (name: string): Promise<any> => {
    try {
        const room = await prisma.room.findFirst({
            where: {
                name,
            },
            include: {
                users: true,
            },
        });
        if (!room) {
            return new Error("Room not found!");
        }
        return room;
    } catch (error: any) {
        return new Error(error);
    }
};

const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const image = req.file?.path;
        const user = (req as CustomRequest).user;
        logger.info(user);
        if (!user) {
            return res.json(ComputeResponse(false, "Unable to find user"));
        }
        const room = await prisma.room.create({
            data: {
                name,
                description,
                avatar: image ? image : "",
                messageCount: 0,
                admin: user.username,
            },
        });
        await addUserToRoom(user, room);
        const createdRoom = await getRoom(room.name);
        res.json(
            ComputeResponse(true, "Room Created", {
                room: room.name,
                members: createdRoom.users,
            })
        );
    } catch (error) {
        return res
            .status(HTTPStatusCode.SERVER_ERROR)
            .json(ComputeResponse(false, "Error occurred", error));
    }
};

const deleteRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.room.delete({
            where: {
                id,
            },
        });
        res.json(ComputeResponse(true, "Room Deleted"));
    } catch (error) {
        res.json(ComputeResponse(false, "Unable to delete room", error));
    }
};
interface IUpdateBody {
    name?: string;
    description?: string;
    avatar?: string | undefined;
}

const updateRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const avatar = req.file?.path;

    const updateBody: IUpdateBody = {};
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
        const room = await prisma.room.update({
            where: {
                id,
            },
            data: updateBody,
        });
        res.json(ComputeResponse(true, "Room Updated", room.name));
    } catch (error) {}
};

const getRoomMembers = async (req: Request, res: Response) => {
    const { room } = req.query;
    try {
        const members = await prisma.room.findFirst({
            include: {
                users: true,
            },
            where: {
                name: String(room),
            },
        });
        res.json(ComputeResponse(true, "Members returned", members));
    } catch (error) {
        res.json(ComputeResponse(false, "Error occurred", error));
    }
};

const getSocketRoomMembers = async (room: string): Promise<any> => {
    try {
        const members = await prisma.room.findFirst({
            include: {
                users: true,
            },
            where: {
                name: String(room),
            },
        });
        return members;
    } catch (error: any) {
        return new Error(error);
    }
};

const addUserToRoom = async (user: User, room: Room): Promise<any> => {
    try {
        await prisma.room.update({
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
    } catch (error: any) {
        return new Error(error);
    }
};

const removeUserFromRoom = async (user: User, room: string): Promise<any> => {
    try {
        await prisma.room.update({
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
    } catch (error: any) {
        return new Error(error);
    }
};

export {
    createRoom,
    getRoom,
    getRoomMembers,
    getSocketRoomMembers,
    deleteRoom,
    updateRoom,
    addUserToRoom,
    removeUserFromRoom,
};
