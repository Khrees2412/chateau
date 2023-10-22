import * as jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {HTTPStatusCode} from "../utils/misc";
import {PrismaClient, User} from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "super";

export interface CustomRequest extends Request {
    user: User | null;
}

export interface JwtPayload {
    aud: string;
    exp: number;
    sub: string;
    email: string;
    app_metadata: {
        provider: string;
    };
    user_metadata: null;
    role: string;
}

const validateAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res
                .status(HTTPStatusCode.UNAUTHORIZED)
                .json("Unauthorized User");
        }

        const authToken = token.split(" ")[1];

        jwt.verify(authToken, jwtSecret, async (err, decoded) => {
            logger.info(decoded);
            if (err) {
                return res.status(HTTPStatusCode.UNAUTHORIZED).json(err);
            }

            const {email} = decoded as JwtPayload;
            const user = await prisma.user.findUnique({
                where: {email},
            });
            (req as CustomRequest).user = user;
            next();
        });
    } catch (error) {
        return res.status(HTTPStatusCode.SERVER_ERROR).json(error);
    }
};

export {validateAuth};
