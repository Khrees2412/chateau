import { Request, Response } from "express";
import logger from "../utils/logger";
import { CustomRequest } from "../middleware/auth";
import { ComputeResponse, HTTPStatusCode } from "../utils/misc";

interface CreateRoomRequest {
    name:string
    description: string
    participantLimit: number
}

const createRoom = async (req: Request, res: Response) => {
    try {
        const body: CreateRoomRequest = req.body
        const { name, description, participantLimit } = req.body;
        const image = req.file?.path;
        const user = (req as CustomRequest).user;
        logger.info(user);
        if (!user) {
            return res.json(ComputeResponse(false, "Unable to find user"));
        }

        res.json(
            ComputeResponse(true, "Room Created", {
                // room: room.name,
                // members: createdRoom.users,
            })
        );
    } catch (error) {
        return res
            .status(HTTPStatusCode.SERVER_ERROR)
            .json(ComputeResponse(false, "Error occurred", error));
    }
};
;
interface IUpdateBody {
    name?: string;
    description?: string;
    avatar?: string | undefined;
}

const updateRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const avatar = req.file?.path;

    const updateBody: IUpdateBody = {};
    if (name) {
        updateBody.name = name;
    }
    if (description) {
        updateBody.description = description;
    }
    if (avatar) {
        updateBody.avatar = avatar;
    }


};

const getSocketRoomMembers = async (room: string): Promise<any> => {
    try {
        // const members = await prisma.room.findFirst({
        //     include: {
        //         users: true,
        //     },
        //     where: {
        //         name: String(room),
        //     },
        // });
        // return members;
    } catch (error: any) {
        return new Error(error);
    }
};


export {
    createRoom,
    getSocketRoomMembers,
   updateRoom
};
