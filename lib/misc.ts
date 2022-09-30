export enum HTTPStatusCode {
    OK = 200,
    CREATED = 201,
    REDIRECT = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    SERVER_ERROR = 500,
}
interface IComputeResponse {
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
