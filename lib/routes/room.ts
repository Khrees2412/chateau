import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import {
    createRoom,
    updateRoom,
} from "../controller/room";
import { validateAuth } from "../middleware/auth";

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

roomRouter.get("/members", validateAuth);
roomRouter.get("/", validateAuth)
roomRouter.post("/", validateAuth, upload.single("picture"), createRoom);
roomRouter.delete("/:id", validateAuth);
roomRouter.put("/:id", validateAuth, updateRoom);

export default roomRouter;
