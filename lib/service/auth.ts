import bcrypt from "bcrypt";
// import * as jwt from "jsonwebtoken";
import {supabase} from "../utils/supabase";
import {AuthError, isAuthError} from "../utils/error";
import logger from "../utils/logger";
import {createUser} from "../repository/auth";

async function hashData(data: string) {
    return await bcrypt.hash(data, 14);
}

interface authDTO {
    username: string;
    password: string;
    email: string;
}

interface resetPwDTO {
    email: string
    password: string
}

class AuthService {
    constructor() {
    }

    async register(body: authDTO): Promise<string | AuthError> {
        const {username, password, email} = body;
        const pw = await hashData(password);
        try {
            const {data, error} = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if (data.user) {
                await createUser({
                    username: username,
                    email: email,
                    password: pw,
                    id: data.user.id
                });
            } else {
                throw new Error("unable to create user")
            }
            return "user created"
        } catch (error) {
            logger.error(error);

            if (isAuthError(error)) {
                return error
            }
            throw error
        }
    };

    async login(body: authDTO): Promise<string | AuthError> {
        const {password, email} = body;
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
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

    async resetPasswordService(body: authDTO): Promise<string | AuthError> {
        try {
            const {data, error} = await supabase.auth.resetPasswordForEmail(body.email, {
                redirectTo: "https://chateau.railway.app/auth/reset-password",
            });
            return "Check your registered email to continue"
        } catch (error) {
            if (isAuthError(error)) {
                return error
            }
            logger.error(error);
            throw error
        }
    };

}


async function signOutService() {
    const {error} = await supabase.auth.signOut();
}

export {AuthService}
