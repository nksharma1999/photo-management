import express from "express";
import { deletePerson, getPeople, getPersonPhotos, mergePeople, renamePerson } from "../controllers/peopleController";

const router = express.Router();

router.get("/", getPeople);
router.patch("/:id", renamePerson);
router.post("/merge", mergePeople);
router.get("/:id/photos", getPersonPhotos);
router.delete("/:id", deletePerson);
export default router;