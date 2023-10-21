import {Request, Response} from "express";
import {ComputeResponse} from "../utils/misc";
import MessageService from "../service/message";

const messageService = new MessageService()

const sendMessage = async (
    req: Request, res: Response
): Promise<any> => {
    try {

        const userId = ""
        const {roomId, content, messageType} = req.body
        const response = messageService.createMessage({
            senderId: userId,
            roomId: roomId,
            content: content,
            messageType: messageType
        })
        return ComputeResponse(true, "Message sent successfully", response);
    } catch
        (e) {
        return ComputeResponse(false, "Unable to send message", e)
    }
}


const deleteMessage = async (messageId: string): Promise<any> => {
    try {

        return ComputeResponse(true, "Message deleted successfully", null);
    } catch (error: any) {
        return new Error(error);
    }
};
export {sendMessage, deleteMessage};
