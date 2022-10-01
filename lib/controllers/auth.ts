import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Prisma, PrismaClient } from "@prisma/client";
import { HTTPStatusCode } from "../misc";
import redisClient from "../config/redis";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;
const CODE_EXPIRY = 300;
const prisma = new PrismaClient();

async function hashData(data: string) {
    return await bcrypt.hash(data, 14);
}

const register = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    const pw = await hashData(password);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: pw,
        },
    });
    res.status(HTTPStatusCode.CREATED).json({
        success: true,
        message: "User created successfully",
        data: user.username,
    });
};

const login = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;

    try {
        let user;
        if (username) {
            user = await prisma.user.findUnique({
                where: {
                    username,
                },
            });
        } else if (email) {
            user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });
        }
        if (user) {
            const validPw = await bcrypt.compare(password, user.password);
            if (!validPw) {
                res.json({
                    success: false,
                    message: "Invalid Password",
                });
            }
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                JWT_SECRET,
                {
                    expiresIn: JWT_TOKEN_EXPIRY,
                }
            );
            res.status(HTTPStatusCode.OK).json({
                success: true,
                message: "Login successful",
                data: {
                    accessToken: token,
                },
            });
        }
    } catch (error) {
        res.status(HTTPStatusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong, try again",
        });
    }
};
const resetPassword = (req: Request, res: Response) => {};

const verifyEmail = (req: Request, res: Response) => {};

const sendCode = (req: Request, res: Response) => {};

const setCode = (email: string, code: string) => {
    redisClient.setEx(email, CODE_EXPIRY, code);
};

const getCode = (email: string) => {
    return redisClient.get(email);
};

const deleteCode = (email: string) => {
    return redisClient.del(email);
};
export { register, login };
