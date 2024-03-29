const JWT_SECRET = process.env.JWT_SECRET || "super";
const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;
const CODE_EXPIRY = 300;
import {prisma} from "../../prisma/prisma";


interface createUserDTO {
    username: string
    password: string
    email: string
    id:string
}

export const createUser = async (user: createUserDTO) => {
   try {
       const createdUser = await prisma.user.create({
           data: {
               username: user.username,
               email: user.email,
               password: user.password,
               active: true,
               id: user.id
           },
       });
       return createdUser
   }catch (e) {
       return e
   }

}
const findUserById = (userId: string) => {

}
const findUserByUsername = (username: string) => {

}

const findUserByEmail = (email: string) => {

}
const updateUser = async (user: createUserDTO) => {

}