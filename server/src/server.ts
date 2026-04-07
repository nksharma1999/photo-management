import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import photoRoutes from "./routes/photoRoutes"
import connectDB from "./config/db"
import aiRoutes from "./routes/aiRoutes";
import peopleRoutes from "./routes/peopleRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import albumRoutes from "./routes/albumRoutes";

dotenv.config({path:"./config/.env"});
const PORT = process.env.SERVER_PORT
const MONGODB_URL = process.env.MONGODB_URL;
const facePath = process.env.FACES_PATH || "Faces";
const uploadsPath = process.env.UPLOADS_PATH || "uploads";
const thumbnailsPath = process.env.THUMBNAILS_PATH || "thumbnails"
const app = express()
connectDB(MONGODB_URL);

app.use(cors())
app.use(express.json())

app.use("/Faces", express.static(facePath))
app.use("/uploads", express.static(uploadsPath))
app.use("/thumbnails", express.static(thumbnailsPath))

app.get("/api/server-health", (req,res) =>{
    res.status(200).json("Server Running...");
})
app.use("/api/photos", photoRoutes)
app.use("/api/ai", aiRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/albums", albumRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})