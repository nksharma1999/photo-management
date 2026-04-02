import express from "express";
import { clusterFaces } from "../services/faceClusterService";
import dotenv from 'dotenv';

dotenv.config({path:'../config/.env'});
const FACE_API_BASE_URL = process.env.FACE_API_URL;


const router = express.Router();

router.get("/cluster", async (req, res) => {
  const result = await clusterFaces(FACE_API_BASE_URL);
  res.json(result);
});

export default router;