import { User } from "../../models/user.model.js";

const EDIT_INTERVAL = 24 * 60 * 60 * 1000; 

export const editUser = async (req, res) => {
    const { username, email, nationality } = req.body;

    try {
        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        const now = new Date();

      
        const lastEditAt = currentUser.lastEditAt instanceof Date ? currentUser.lastEditAt : new Date(0);
        const timeSinceLastEdit = now - lastEditAt;

        if (timeSinceLastEdit < EDIT_INTERVAL) {
            const remainingTime = ((EDIT_INTERVAL - timeSinceLastEdit) / (60 * 60 * 1000)).toFixed(2);
            return res.status(400).json({
                success: false,
                message: `Debes esperar ${remainingTime} horas para editar tu perfil nuevamente.`,
            });
        } 

         const isSameData =
            (username === undefined || username === currentUser.username) &&
            (email === undefined || email === currentUser.email) &&
            (nationality === undefined || nationality === currentUser.nationality);

        if (isSameData) {
            return res.status(400).json({
                success: false,
                message: "No es posible actualizar el usuario con los mismos datos.",
            });
        }

        if (username && (username.length < 3 || username.length > 10)) {
            return res.status(400).json({
                success: false,
                message: "El nombre de usuario debe tener entre 3 y 10 caracteres.",
            });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "El email no es válido.",
            });
        }

     
        if (email && email !== currentUser.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "El email ya está en uso por otro usuario.",
                });
            }
        }

       
        const updateData = { lastEditAt: now };
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (nationality) updateData.nationality = nationality;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password -verificationToken -verificationTokenExpiresAt -loginAttempts -lastEditAt -friendRequests -friends -posts -notifications -chatRooms -__v");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            message: "Usuario actualizado exitosamente",
            user: {
                ...updatedUser._doc,
                password: undefined, 
            },
        });
    } catch (error) {
        console.error("Error en editUser:", error);
        res.status(500).json({
            success: false,
            message: "Error del servidor",
        });
    }
};

export const searchUsers = async (req, res) => {
    const { username } = req.query;

    if (!username || username.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "El nombre de usuario es requerido",
        });
    }

    try {
        const users = await User.find({
            username: { $regex: new RegExp(username, "i") },
            _id: { $ne: req.userId }
        }).select("username avatar");

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error en searchUsers:", error);
        res.status(500).json({
            success: false,
            message: "Error del servidor",
        });
    }
};

export const getUserByUsername = async (req, res) => {
    const { username } = req.params;
    
    try {
        const user = await User.findOne({ username }).select("-password -verificationToken -__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error en getUserByUsername:", error);
        res.status(500).json({
            success: false,
            message: "Error del servidor",
        });
    }
};
