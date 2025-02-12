import express from "express";
import { verifyAuth } from "../../middlewares/verifyAuth.js";
import { editUser } from "../controllers/user.controllers.js";
import { uploadImage } from "../controllers/upload.controllers.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router.patch("/update-user", verifyAuth, editUser)
router.post("/upload", verifyAuth, upload, uploadImage)

export default router