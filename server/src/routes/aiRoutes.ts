import express from "express";
import { clusterFaces } from "../services/faceClusterService";

const router = express.Router();

router.get("/cluster", async (req, res) => {
  const result = await clusterFaces();
  res.json(result);
});

export default router;