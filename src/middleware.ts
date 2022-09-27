import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HTTPStatusCode } from "./misc";

const jwtSecret = process.env.JWT_SECRET || "";

const validateAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res
            .status(HTTPStatusCode.UNAUTHORIZED)
            .json("Unauthorized User");
    }
    try {
        const authToken = token.split(" ")[1];
        const decoded = jwt.verify(authToken, jwtSecret);
        if (decoded) {
            next();
        }
    } catch (err) {
        console.error("something wrong with auth middleware");
        res.status(500).json({ msg: "Server Error" });
    }
};
