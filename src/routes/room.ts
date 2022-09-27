import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import {
    createRoom,
    deleteRoom,
    getRoomMembers,
    updateRoom,
} from "../controllers/room";
import { validateAuth } from "../middleware";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {},
});

const upload = multer({ storage: storage });

const roomRouter = Router();
roomRouter.use("/rooms");

roomRouter.get("/members", validateAuth, getRoomMembers);
roomRouter.post("/", validateAuth, upload.single("picture"), createRoom);
roomRouter.delete("/:id", validateAuth, deleteRoom);
roomRouter.put("/:id", validateAuth, updateRoom);

export default roomRouter;
