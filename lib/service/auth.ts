import bcrypt from "bcrypt";
import {Request, Response} from "express";
import {ComputeResponse, HTTPStatusCode} from "../utils/misc";
import * as jwt from "jsonwebtoken";

async function hashData(data: string) {
    return await bcrypt.hash(data, 14);
}
interface authDTO {
    username: string
    password:string
    email:string
}

const registerService = async (body: authDTO) => {
    try {
        const { username, password, email } = body;
        const pw = await hashData(password);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: pw,
                active: false,
            },
        });

    } catch (error) {

    }
};

const loginService = async (body: authDTO) => {
    const { username, password, email } = body;

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

export {registerService,loginService}