import {supabase} from "../utils/supabase";
import {getUniqueId, MessageType} from "../utils/misc";
import {MessageRepo} from "../repository/message";

declare type ContentType = string | File

interface createMessageDTO {
    content: ContentType
    roomId: string
    senderId: string
    messageType: string
}

const messageRepo = new MessageRepo()

export default class MessageService {
    constructor() {
    }

    async createMessage(body: createMessageDTO) {
        try {
            if (typeof body.content !== "string") {
                const data = await convertMediaToUrl(body.content, getUniqueId())
                if (typeof data === "string") {
                    await messageRepo.createMessage({
                        senderId: body.senderId,
                        roomId: body.roomId,
                        content: data,
                        messageType: MessageType.media
                    })
                    return data
                } else {
                    const d = data as unknown as string
                    throw new Error(d)
                }
            } else {
                await messageRepo.createMessage({
                    senderId: body.senderId,
                    roomId: body.roomId,
                    content: body.content,
                    messageType: MessageType.media
                })
                return "Message Created"
            }

        } catch (e: any) {

        }
    }

    async deleteMessage() {

    }

    async editMessage() {

    }

    async getMessage() {

    }

    async listMessages() {

    }
}


const convertMediaToUrl = async (body: File, filename: string): Promise<string | Error> => {
    try {
        const {data, error} = await supabase
            .storage
            .from('avatars')
            .upload(`public/${filename}`, body, {
                cacheControl: '3600',
                upsert: false
            })
        return data?.path as string
    } catch (e: any) {
        throw new Error(e)
    }

}