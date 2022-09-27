import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HTTPStatusCode } from "./misc";
import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

const validateAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization;
    if (!token) {
        return res
            .status(HTTPStatusCode.UNAUTHORIZED)
            .json("Unauthorized User");
    }
    try {
        const authToken = token.split(" ")[1];
        const decoded = jwt.verify(authToken, jwtSecret);
        if (typeof decoded !== "string") {
            // const user = await prisma.user.findUnique({
            //     where: {
            //         id: decoded.id,
            //     },
            // });
            // if (!user) {
            //     res.json("Unable to decode user or invalid JWT");
            // }
            res.locals.user = decoded.id;
            next();
        }
    } catch (err) {
        console.error("something wrong with auth middleware");
        res.status(500).json({ msg: "Server Error" });
    }
};

export { validateAuth };
