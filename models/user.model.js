import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
         trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    username: {
        type: String,
        minlength: 3,
        trim: true
    },
    sexo: {
        type: String,
        required: true,
        enum: ['Femenino', 'Masculino']
    },
    nationality: {
        type: String,
        trim: true,
         default: 'Desconocido'
    },
    birthDate: {
        type: Date,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false, 
    },
    avatar: { type: String, default: 'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere.png' }, 
    bio: { type: String, default: 'Este usuario no ha agregado una biografía.' },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }], 
    chatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' }],
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    loginAttempts: {
        type: Number,
        default: 0, 
      },
      lockUntil: {
        type: Date, 
      },
      lastEditAt: {
        type: Date,
        default: new Date(0), 
      },
},{timestamps: true})

export const User = mongoose.model("User", userSchema)