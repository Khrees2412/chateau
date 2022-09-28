export enum HTTPStatusCode {
    OK = 200,
    CREATED = 201,
    REDIRECT = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    SERVER_ERROR = 500,
}

const users: IUser[] = [];

interface IUser {
    id: string;
    name: string;
    room: string;
}

const getUser = (id: string): IUser | any =>
    users.find((user) => user.id === id);

const getUsersInRoom = (room: string) =>
    users.filter((user) => user.room === room);

interface IComputeResponse {
    success: boolean;
    message: string;
    data?: any;
}

function ComputeResponse(
    success: boolean,
    message: string,
    data?: any
): IComputeResponse {
    return {
        success,
        message,
        data,
    };
}

export { getUser, getUsersInRoom, ComputeResponse };
