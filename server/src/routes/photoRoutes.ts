import express from "express"
import multer from "multer"
import { deletePhoto, getPhotos, getRecentPhotos, getPhotosByDate, toggleFavorite, uploadPhoto } from "../controllers/photoController"
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
router.get("/recent", getRecentPhotos)
router.get("/by-date", getPhotosByDate)

router.post("/upload",upload.single("photo"),uploadPhoto)

router.patch("/:id/favorite",toggleFavorite)

router.delete("/:id",deletePhoto)

export default router