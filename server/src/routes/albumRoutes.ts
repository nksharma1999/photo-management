import express from "express";
import {
  getAlbums,
  createAlbum,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum,
} from "../controllers/albumController";

const router = express.Router();

router.get("/", getAlbums);
router.post("/", createAlbum);
router.get("/:id", getAlbumById);
router.patch("/:id", updateAlbum);
router.delete("/:id", deleteAlbum);

router.post("/:id/photos", addPhotoToAlbum);
router.delete("/:id/photos/:photoId", removePhotoFromAlbum);

export default router;
