import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HTTPStatusCode } from "../misc";
import { PrismaClient, User } from "@prisma/client";
import logger from "../logger";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "super";

export interface CustomRequest extends Request {
    user: User | null;
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

            const { id } = decoded as { id: string };
            const user = await prisma.user.findUnique({
                where: { id },
            });
            (req as CustomRequest).user = user;
            next();
        });
    } catch (error) {
        return res.status(HTTPStatusCode.SERVER_ERROR).json(error);
    }
};

export { validateAuth };
