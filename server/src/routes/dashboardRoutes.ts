import express from "express";
import { getStats, getTopPeople, getLocations } from "../controllers/dashboardController";

const router = express.Router();

router.get("/stats", getStats);
router.get("/people", getTopPeople);
router.get("/locations", getLocations);

export default router;
