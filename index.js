import express from "express"
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv" 
import authRoutes from "./Auth/routes/auth.route.js"
import userRoutes from "./User/routes/user.route.js"
import adminRoutes from "./Admin/routes/admin.route.js"
import postsRoutes from "./Posts/routes/posts.route.js"

import cookieParser from "cookie-parser";
import cors from "cors"

 dotenv.config() 

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/admin", adminRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => {
    console.error("Error al conectar con la base de datos:", err);
});