"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const room_1 = require("../controllers/room");
const middleware_1 = require("../middleware");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {},
});
const upload = (0, multer_1.default)({ storage: storage });
const roomRouter = (0, express_1.Router)();
roomRouter.use("/rooms");
roomRouter.get("/rooms/members", middleware_1.validateAuth, room_1.getRoomMembers);
roomRouter.post("/rooms", middleware_1.validateAuth, upload.single("picture"), room_1.createRoom);
roomRouter.delete("/rooms/:id", middleware_1.validateAuth, room_1.deleteRoom);
roomRouter.put("/rooms/:id", middleware_1.validateAuth, room_1.updateRoom);
exports.default = roomRouter;
