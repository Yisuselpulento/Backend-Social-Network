import express from "express";
import { verifyAuth } from "../../middlewares/verifyAuth.js";
import { upload } from "../../middlewares/multer.js";
import { createPost, deletePost, getAllPosts, getUserPosts, likePost } from "../controllers/posts.controllers.js";


const router = express.Router();

router.get("/getall",verifyAuth, getAllPosts);
router.post("/create", verifyAuth, upload,  createPost)
router.patch("/togglelike/:id", verifyAuth, likePost)
router.delete("/delete/:id", verifyAuth, deletePost)
router.get("/posts/user/:userId",verifyAuth, getUserPosts);

export default router