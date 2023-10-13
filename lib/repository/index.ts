const JWT_SECRET = process.env.JWT_SECRET || "super";
const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;
const CODE_EXPIRY = 300;
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/**
 *
 * Create(user *models.User) error
 *    FindByUserId(userId string) (*models.User, error)
 *    FindByMonoId(monoId string) (*models.User, error)
 *    FindByEmail(email string) (*models.User, error)
 *    Update(user *models.User) error
 *    DoesUsernameExist(username string) (bool, error)
 *    DoesEmailExist(email string) (bool, error)
 *    DoesPhoneNumberExist(phoneNumber string) (bool, error)
 *
 */

interface createUserDTO {

}

async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'example@email.com',
        password: 'example-password',
    })
}

async function signOut() {
    const { error } = await supabase.auth.signOut()
}

const createUser = (user: createUserDTO)   => {

}
const findUserById = (userId:string) => {

}
const findUserByUsername = (username:string) => {

}

const findUserByEmail = (email:string) => {

}
const updateUser = (user: createUserDTO) => {

}