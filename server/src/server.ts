import express from "express"
import cors from "cors"
import photoRoutes from "./routes/photoRoutes"
import connectDB from "./config/db"
import aiRoutes from "./routes/aiRoutes";
import peopleRoutes from "./routes/peopleRoutes";

const app = express()
connectDB();
app.use(cors())
app.use(express.json())
app.get("/api/test", (req,res) =>{
    res.status(200).json("Ok");
})
app.use("/uploads", express.static("uploads"))
app.use("/thumbnails", express.static("thumbnails"))

app.use("/api/photos", photoRoutes)
app.use("/api/ai", aiRoutes);
app.use("/api/people", peopleRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000")
})