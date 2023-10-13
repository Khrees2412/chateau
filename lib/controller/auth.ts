import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Prisma, PrismaClient } from "@prisma/client";
import { ComputeResponse, HTTPStatusCode } from "../utils/misc";
import redisClient from "../config/redis";
import SendMail, { IMailData } from "../config/mail";
import logger from "../utils/logger";
import {registerService, loginService} from "../service/auth";

const JWT_SECRET = process.env.JWT_SECRET || "super";
const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;
const CODE_EXPIRY = 300;
const prisma = new PrismaClient();

async function hashData(data: string) {
    return await bcrypt.hash(data, 14);
}

const register = async (req: Request, res: Response) => {
    try {
        const data = registerService(req.body)
        res.status(HTTPStatusCode.CREATED).json({
            success: true,
            message: "User created successfully",
            data: data.username,
        });
    } catch (error) {
        res.status(HTTPStatusCode.BAD_REQUEST).json(
            ComputeResponse(false, "Error occurred", error)
        );
    }
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
export const resetPassword = (req: Request, res: Response) => {
    const { code } = req.body;
};

export const verifyEmail = async (req: Request, res: Response) => {
    const code = req.params.code;
    const redisCode = await getCode(req.body.email);
    if (code === redisCode) {
        res.json(ComputeResponse(true, "Email Verified!"));
    }
};

const sendCode = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        const code = randomCodeGenerator();
        setCode(email, code);
        const data: IMailData = {
            email,
            name: user ? user.username : "Hi there!",
            subject: "Chateau Code",
            text: `Your Chateau code is ${code}. You can finish up your registration`,
        };
        await SendMail(data);
        res.json(ComputeResponse(true, "Sent Code to email address!"));
    } catch (error) {
        logger.error(error);
        res.json(
            ComputeResponse(
                false,
                "Something went wrong while sending code",
                error
            )
        );
    }
};

const randomCodeGenerator = (num: number = 5) => {
    const nums = "1326458790";
    let code: string = "";

    for (let i = 1; i <= num; i++) {
        const random = Math.floor(Math.random() * 10);
        code += nums[random];
    }

    return code;
};

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
