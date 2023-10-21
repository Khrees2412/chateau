import bcrypt from "bcrypt";
// import * as jwt from "jsonwebtoken";
import { supabase } from "../utils/supabase";
import {AuthError, isAuthError} from "../utils/error";
import logger from "../utils/logger";
import { createUser } from "../repository/auth";

async function hashData(data: string) {
    return await bcrypt.hash(data, 14);
}
interface authDTO {
    username: string;
    password: string;
    email: string;
}
interface resetPwDTO {
    email:string
    password:string
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
}

const registerService = async (body: authDTO):Promise<string | AuthError> => {
    const { username, password, email } = body;
    const pw = await hashData(password);
    try {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (error) {
            throw new Error(error as unknown as string);
        }
        const res = await createUser({
            username: username,
            email: email,
            password: pw,
        });
        return ""
    } catch (error) {
        if (isAuthError(error)) {
            return error
        }
        logger.error(error);
        throw error
    }
};

const loginService = async (body: authDTO) : Promise<string | AuthError> => {
    const { password, email } = body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return data.user?.id!;
    } catch (error) {
        if (isAuthError(error)) {
            return error
        }
        logger.error(error);
        throw error
    }
};

const resetPasswordService = async (body: authDTO) :Promise<string | AuthError> => {
    try {
      const {data, error} =  await supabase.auth.resetPasswordForEmail(body.email, {
            redirectTo: "https://chateau.railway.app/auth/reset-password",
        });
      return "Check your registered email to continue"
    }catch (error) {
        if (isAuthError(error)) {
            return error
        }
        logger.error(error);
        throw error
    }
};


export { registerService, loginService, resetPasswordService };
