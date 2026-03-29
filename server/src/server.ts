import express from "express"
import cors from "cors"
import photoRoutes from "./routes/photoRoutes"
import connectDB from "./config/db"
import aiRoutes from "./routes/aiRoutes";
import peopleRoutes from "./routes/peopleRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import albumRoutes from "./routes/albumRoutes";

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
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/albums", albumRoutes);

app.listen(5001, () => {
  console.log("Server running on port 5001")
})