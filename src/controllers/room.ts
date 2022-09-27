import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ComputeResponse } from "../misc";

const prisma = new PrismaClient();

const createRoom = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const image = req.file?.path;
    try {
        const room = await prisma.room.create({
            data: {
                name,
                description,
                avatar: String(image),
                messageCount: 0,
            },
        });
        res.json(ComputeResponse(true, "Room Created", room.name));
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

export { createRoom, getRoomMembers };
