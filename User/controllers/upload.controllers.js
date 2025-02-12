import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { User } from "../../models/user.model.js";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No se ha proporcionado una imagen." });
        }

        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado." });
        }

        if (currentUser.avatar && !currentUser.avatar.includes("pngwing.com")) {
            const publicId = currentUser.avatar.split("/").pop().split(".")[0]; 
            await cloudinary.uploader.destroy(`avatars/${publicId}`);
        }

        cloudinary.uploader.upload_stream(
            { 
                folder: "avatars", 
                transformation: [{ width: 800, height: 800, crop: "limit" }]
            },
            async (error, result) => {
                if (error) {
                    console.error("Error en Cloudinary:", error);
                    return res.status(500).json({ success: false, message: "Error al subir la imagen." });
                }

                currentUser.avatar = result.secure_url;
                await currentUser.save();

                res.status(200).json({
                    success: true,
                    message: "Imagen subida con éxito",
                    user: {avatar : result.secure_url }
                });
            }
        ).end(req.file.buffer);

    } catch (error) {
        console.error("Error al subir imagen:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};