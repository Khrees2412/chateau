import {PrismaClient, Room, User} from "@prisma/client";

const prisma = new PrismaClient();

interface CreateRoomBody {
    name: string
    description: string
    participantLimit: number
    admin: string
    avatar: string
}

interface UpdateRoomBody {
    name?: string;
    description?: string;
    avatar?: string;

}

interface UpdateMembershipBody {
    roomId: string
    userId: string
}

class RoomRepository {
    constructor() {
    }

    async create(body: CreateRoomBody) {
        try {
            const room = await prisma.room.create({
                data: {
                    name: body.name,
                    description: body.description,
                    participantLimit: body.participantLimit,
                    admin: body.admin,
                    messageCount: 0,
                    avatar: body.avatar
                }
            })
        } catch (error) {
            throw new Error(error as unknown as string)
        }
    }

    async delete(id: string) {
        try {
            await prisma.room.delete({
                where: {
                    id,
                },
            });
        } catch (error) {
            throw new Error(error as unknown as string)
        }
    }

    async update(id: string, details: UpdateRoomBody) {
        try {
            const room = await prisma.room.update({
                where: {
                    id,
                },
                data: details,
            });
        } catch (error) {
        }
    }

    async addUserToRoom(body: UpdateMembershipBody): Promise<any> {

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: body.userId
                }
            })
            if (user) {
                await prisma.room.update({
                    where: {
                        id: body.roomId,
                    },
                    data: {
                        users: {
                            create: user,
                        },
                    },
                });
            } else {
                return "invalid user"
            }
            return "user added to room";
        } catch (error) {
            return new Error(error as unknown as string);
        }

    }

    async removeUserFromRoom(body: UpdateMembershipBody): Promise<any> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: body.userId
                }
            })
            if (user) {
                await prisma.room.update({
                    where: {
                        id: body.roomId,
                    },
                    data: {
                        users: {
                            delete: user,
                        },
                    },
                });
            } else {
                return "invalid user"
            }
            return "user removed from room";
        } catch (error) {
            return new Error(error as unknown as string);
        }
    };

    async findById(id: string) {
        try {
            const room = await prisma.room.findFirst({
                where: {
                    id,
                },
                include: {
                    users: true,
                },
            });
            if (!room) {
                return new Error("Room not found!");
            }
            return room;
        } catch (error) {
            return new Error(error as unknown as string);
        }
    }

    async findAll() {
        try {
            const rooms = await prisma.room.findMany({
                include: {
                    users: true,
                },
            });
            return rooms;
        } catch (error) {
            return new Error(error as unknown as string);
        }
    }

}

export default RoomRepository