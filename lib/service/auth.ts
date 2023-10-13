import bcrypt from "bcrypt";
import {Request, Response} from "express";
import {ComputeResponse, HTTPStatusCode} from "../utils/misc";
import * as jwt from "jsonwebtoken";
import {supabase} from "../utils/supabase";
import logger from "../utils/logger";
import {createUser} from "../repository";

async function hashData(data: string) {
    return await bcrypt.hash(data, 14);
}
interface authDTO {
    username: string
    password:string
    email:string
}
const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail('hello@example.com', {
        redirectTo: 'http://example.com/account/update-password',
    })
}

async function signInWithEmail() {
    const {data, error} = await supabase.auth.signInWithPassword({
        email: 'example@email.com',
        password: 'example-password',
    })

}
await supabase.auth.updateUser({password: user.password})

async function signOut() {
    const {error} = await supabase.auth.signOut()
}

const registerService = async (body: authDTO) => {
        const { username, password, email } = body;
        const pw = await hashData(password);
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            }
         await createUser({
             username: username,
             email: email,
             password: pw,
         })
        return data.user
    } catch (error) {
logger.error(error)
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