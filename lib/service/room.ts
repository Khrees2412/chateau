import RoomRepository from "../repository/room";
import {Socket} from "socket.io";


interface CreateRoomBody {
    name: string
    description: string
    participantLimit: number
    admin: string
    avatar: string
}


const roomrepo = new RoomRepository()

class RoomService {
    constructor() {
    }

    async createRoom(body: CreateRoomBody) {
        try {
            const room = await roomrepo.create(body)
            return room
        } catch (error) {
            throw new Error(error as unknown as string)
        }
    }

    async addUserToRoom(userId: string, room: string, socket: Socket) {
        try {
            await socket.join(room)
            await roomrepo.addUserToRoom({
                roomId: room,
                userId: userId
            })
        } catch (error) {
            throw new Error(error as unknown as string)
        }

    }

    async removeUserFromRoom() {

    }

    async deleteRoom() {

    }

    async updateRoom() {

    }

    async getRoom(roomId: string) {
    }

    async getAllRooms() {
    }

}

export default RoomService