import express from "express"
import multer from "multer"
import { deletePhoto, getPhotos, toggleFavorite, uploadPhoto } from "../controllers/photoController"
import db from "../config/db"

const router = express.Router()

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

router.get("/",getPhotos)

router.post("/upload",upload.single("photo"),uploadPhoto)

router.patch("/:id/fav",toggleFavorite)

router.delete("/:id",deletePhoto)

export default router