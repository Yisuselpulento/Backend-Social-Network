import { Post } from "../../models/post.model.js";
import { User } from "../../models/user.model.js";
import { Notification } from "../../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let imageUrl = null;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "posts", transformation: [{ width: 1000, height: 1000, crop: "limit" }] },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        }

        if (!text && !imageUrl) {
            return res.status(400).json({ success: false, message: "El post debe contener al menos texto o una imagen." });
        }

        const newPost = new Post({
            user: req.userId,
            text: text || "",
            image: imageUrl
        });

        await newPost.save();
        return res.status(201).json({ success: true, message: "Post creado exitosamente", post: newPost });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post no encontrado" });
        }

        if (post.user.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "No tienes permisos para eliminar este post" });
        }

        if (post.image) {
            try {
                const publicId = post.image.split("/").pop().split(".")[0]; 
                await cloudinary.uploader.destroy(`posts/${publicId}`);
            } catch (error) {
                console.error("Error al eliminar imagen de Cloudinary:", error);
            }
        }

        await post.deleteOne();
        return res.status(200).json({ success: true, message: "Post eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("user", "_id username");

        if (!post) {
            return res.status(404).json({ success: false, message: "Post no encontrado" });
        }

        const hasLiked = post.likes.includes(req.userId);

        if (hasLiked) {
            post.likes = post.likes.filter(userId => userId.toString() !== req.userId);
        } else {
            post.likes.push(req.userId);

            if (post.user._id.toString() !== req.userId) {
                const sender = await User.findById(req.userId).select("username");

                if (!sender) {
                    return res.status(404).json({ success: false, message: "Usuario no encontrado" });
                }

                const notification = new Notification({
                    user: post.user._id,
                    sender: req.userId,
                    type: "like",
                    message: `${sender.username} le dio like a tu post.`,
                });
                await notification.save();

                await User.findByIdAndUpdate(post.user._id, {
                    $push: { notifications: notification._id }
                });
            }
        }

        await post.save();
        return res.status(200).json({ success: true, message: hasLiked ? "Like eliminado" : "Like agregado" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const posts = await Post.find({ 
            user: { $in: [...currentUser.following, currentUser._id] }
        })
        .populate("user", "username avatar")
        .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, posts });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await Post.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "username avatar") 

        return res.status(200).json({ success: true, posts });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
