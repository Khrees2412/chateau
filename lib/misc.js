"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeResponse = exports.HTTPStatusCode = void 0;
var HTTPStatusCode;
(function (HTTPStatusCode) {
    HTTPStatusCode[HTTPStatusCode["OK"] = 200] = "OK";
    HTTPStatusCode[HTTPStatusCode["CREATED"] = 201] = "CREATED";
    HTTPStatusCode[HTTPStatusCode["REDIRECT"] = 302] = "REDIRECT";
    HTTPStatusCode[HTTPStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTPStatusCode[HTTPStatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTPStatusCode[HTTPStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTPStatusCode[HTTPStatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(HTTPStatusCode = exports.HTTPStatusCode || (exports.HTTPStatusCode = {}));
function ComputeResponse(success, message, data) {
    return {
        success,
        message,
        data,
    };
}
exports.ComputeResponse = ComputeResponse;
