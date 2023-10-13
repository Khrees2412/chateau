import { Router } from "express";
import { login, register, resetPassword } from "../controller/auth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/reset-password", )

export default authRouter;
