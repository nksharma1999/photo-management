import express from "express";
import { getStats, getTopPeople, getLocations, getDataFor3DMap } from "../controllers/dashboardController";

const router = express.Router();

router.get("/stats", getStats);
router.get("/people", getTopPeople);
router.get("/locations", getLocations);
router.get("/map-data", getDataFor3DMap);

export default router;
