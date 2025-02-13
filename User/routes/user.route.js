import express from "express";
import { verifyAuth } from "../../middlewares/verifyAuth.js";
import { editUser, getUserByUsername, searchUsers } from "../controllers/user.controllers.js";
import { uploadImage } from "../controllers/upload.controllers.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router.patch("/update-user", verifyAuth, editUser)
router.post("/upload", verifyAuth, upload, uploadImage)
router.get("/search-users",verifyAuth, searchUsers);
router.get("/:username", verifyAuth, getUserByUsername);

export default router