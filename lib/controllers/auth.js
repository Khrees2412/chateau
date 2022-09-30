"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const misc_1 = require("../misc");
const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;
const prisma = new client_1.PrismaClient();
function hashData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(data, 14);
    });
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    const pw = yield hashData(password);
    const user = yield prisma.user.create({
        data: {
            username,
            email,
            password: pw,
        },
    });
    res.status(misc_1.HTTPStatusCode.CREATED).json({
        success: true,
        message: "User created successfully",
        data: user.username,
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    try {
        let user;
        if (username) {
            user = yield prisma.user.findUnique({
                where: {
                    username,
                },
            });
        }
        else if (email) {
            user = yield prisma.user.findUnique({
                where: {
                    email,
                },
            });
        }
        if (user) {
            const validPw = yield bcrypt_1.default.compare(password, user.password);
            if (!validPw) {
                res.json({
                    success: false,
                    message: "Invalid Password",
                });
            }
            const token = jwt.sign({
                id: user.id,
                email: user.email,
            }, JWT_SECRET, {
                expiresIn: JWT_TOKEN_EXPIRY,
            });
            res.status(misc_1.HTTPStatusCode.OK).json({
                success: true,
                message: "Login successful",
                data: {
                    accessToken: token,
                },
            });
        }
    }
    catch (error) {
        res.status(misc_1.HTTPStatusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong, try again",
        });
    }
});
exports.login = login;
