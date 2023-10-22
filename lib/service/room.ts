import RoomRepository from "../repository/room";


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

        }catch (error){
            throw new Error(error as unknown as string)
        }

    }

    async addUserToRoom() {

    }

    async removeUserFromRoom() {

    }

    async deleteRoom() {

    }

    async updateRoom() {

    }
}