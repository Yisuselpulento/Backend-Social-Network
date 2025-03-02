import express from "express";
import { verifyAuth } from "../../middlewares/verifyAuth.js";
import { editUser, getUserByUsername, getUserNotifications, searchUsers, toggleFollow } from "../controllers/user.controllers.js";
import { uploadImage } from "../controllers/upload.controllers.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router.patch("/update-user", verifyAuth, editUser)
router.post("/upload", verifyAuth, upload, uploadImage)
router.get("/search-users",verifyAuth, searchUsers);
router.get("/get-notifications", verifyAuth, getUserNotifications);
router.get("/:username", verifyAuth, getUserByUsername);
router.post("/toggle-follow", verifyAuth, toggleFollow);

export default router