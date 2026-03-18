import express from "express"
import cors from "cors"
import photoRoutes from "./routes/photoRoutes"
import db from "./config/db"

const app = express()

app.use(cors())
app.use(express.json())
app.get("/api/test", (req,res) =>{
    res.status(200).json("Ok");
})
app.use("/uploads", express.static("uploads"))

app.use("/api/photos", photoRoutes)


async function testDB() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
}

// testDB();
app.listen(5000, () => {
  console.log("Server running on port 5000")
})