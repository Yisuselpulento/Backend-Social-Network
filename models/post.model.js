import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        default: "",
        maxlength: 500
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true, trim: true, minlength: 1, maxlength: 300 },
        createdAt: { type: Date, default: Date.now }
    }],
    visibility: {
        type: String,
        enum: ["public", "friends", "private"],
        default: "public"
    }
}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);