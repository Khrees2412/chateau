import { PrismaClient, Room } from "@prisma/client";
import { Request, Response } from "express";
import { ComputeResponse } from "../misc";

const prisma = new PrismaClient();

const getRoom = async (name: string): Promise<any> => {
    try {
        const room = await prisma.room.findFirst({
            where: {
                name,
            },
        });
        if (!room) {
            return new Error("Room not found!");
        }
        return room;
    } catch (error) {
        return error;
    }
};

const createRoom = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const image = req.file?.path;
    let userId;
    if (res.locals.user) {
        userId = res.locals;
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (user) {
            const room = await prisma.room.create({
                data: {
                    name,
                    description,
                    avatar: String(image),
                    messageCount: 0,
                    admin: "",
                    users: {
                        create: user,
                    },
                },
            });
            res.json(ComputeResponse(true, "Room Created", room.name));
        } else {
            res.json(ComputeResponse(false, "Unable to find user"));
        }
    } catch (error) {}
};

const deleteRoom = (req: Request, res: Response) => {};

const updateRoom = (req: Request, res: Response) => {};

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
const addUserToRoom = (req: Request, res: Response) => {};

export { createRoom, getRoom, getRoomMembers };
