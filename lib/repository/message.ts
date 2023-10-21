import {prisma} from "../../prisma/prisma";
import {MessageType} from "../utils/misc"


interface createMessageRepoDTO {
    content: string
    roomId: string
    senderId: string
    messageType: MessageType
}


class MessageRepo {
    constructor() {
    }

    async createMessage(body: createMessageRepoDTO) {
        try {
            const message = await prisma.message.create({
                data: {
                    content: body.content,
                    roomId: body.roomId,
                    type: body.messageType,
                    senderId: body.senderId,
                },
            });
        } catch (e) {
throw new Error("unable to create message")
        }


    }

    async deleteMessage(messageId: string) {
        try {
            const res = await prisma.message.delete({
                where: {
                    id: messageId
                }
            })

        } catch (e) {

        }
    }

}


export {MessageRepo}