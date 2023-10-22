import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ComputeResponse, HTTPStatusCode } from "../utils/misc";
import { AuthService } from "../service/auth";
import validate from "./validator";

async function hashData(data: string) {
    return await bcrypt.hash(data, 14);
}

const authService = new AuthService()

const register = async (req: Request, res: Response) => {
    try {
        await validate(req,res)
        const data = await authService.register(req.body);
        res.status(HTTPStatusCode.CREATED).json({
            success: true,
            message: "User created successfully",
            data: data,
        });
    } catch (error) {
        res.status(HTTPStatusCode.BAD_REQUEST).json(
            ComputeResponse(false, "Error occurred", error)
        );
    }
};

const login = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    await validate(req, res)

    try {
        const data = await authService.login({username, password, email})
            res.status(HTTPStatusCode.OK).json({
                success: true,
                message: "Login successful",
                data: {
                    data,
                },
            });
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

export { register, login };
