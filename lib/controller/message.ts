import { PrismaClient, Room, User } from "@prisma/client";
import { Request, Response } from "express";
import { ComputeResponse } from "../utils/misc";

const prisma = new PrismaClient();

const createMessage = async (
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
        return ComputeResponse(true, "Message sent successfully", null);
    } catch (error: any) {
        return new Error(error);
    }
};

const deleteMessage = async (messageId: string): Promise<any> => {
    try {
        await prisma.message.delete({
            where: {
                id: messageId,
            },
        });
        return ComputeResponse(true, "Message deleted successfully", null);
    } catch (error: any) {
        return new Error(error);
    }
};
export { createMessage, deleteMessage };
