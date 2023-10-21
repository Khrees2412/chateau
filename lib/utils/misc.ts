import { v4 as uuidv4 } from 'uuid'

export enum MessageType{
    text = "text",
    media = "media"
}

export enum HTTPStatusCode {
    OK = 200,
    CREATED = 201,
    REDIRECT = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    SERVER_ERROR = 500,
}
export interface IComputeResponse {
    success: boolean;
    message: string;
    data?: any;
}

export function ComputeResponse(
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

export const getUniqueId = ():string => {
    return uuidv4();
}
