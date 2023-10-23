import {Request, Response} from "express";
import {ComputeResponse} from "../utils/misc";
import MessageService from "../service/message";

const messageService = new MessageService()


const deleteMessage = async (
    req: Request, res: Response
): Promise<any> => {
    try {

        return ComputeResponse(true, "Message deleted successfully", null);
    } catch (error: any) {
        return new Error(error);
    }
};
export {deleteMessage};
