import { PrismaClient, Room, User } from "@prisma/client";
import { Request, Response } from "express";
import { ComputeResponse } from "../utils/misc";

const prisma = new PrismaClient();

const addMessage = async (
    content: string,
    roomId: string,
    userId: string
): Promise<any> => {
    try {
        await prisma.message.create({
            data: {
                content,
                roomId,
                senderId: userId,
            },
        });
        return "Message added to DB";
    } catch (error: any) {
        return new Error(error);
    }
};

const deleteMessage = () => {};

export { addMessage, deleteMessage };
