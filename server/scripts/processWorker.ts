import connectDB from "../src/config/db";
import Photo from "../src/model/Photo";
import FaceEmbedding from "../src/model/FaceEmbedding";
import { promises as fsPromises } from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import fetch, { FormData, Blob } from "node-fetch";
import { clusterFaces } from "../src/services/faceClusterService";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
const FACE_API_BASE_URL = process.env.FACE_API_URL;
const MONGODB_URL = process.env.MONGODB_URL;
connectDB(MONGODB_URL);

let isImageProccessing = false;

const execFileP = promisify(execFile);

async function convertHeicToJpeg(src: string) {
  const dst = `${src}.jpg`;
  try {
    await execFileP("heif-convert", [src, dst]);
    return dst;
  } catch (e) {
    // fallback to ImageMagick
    await execFileP("magick", [src, dst]);
    return dst;
  }
}

async function processPhoto(p: any) {
  const rel = p.url && p.url.startsWith("/") ? p.url.slice(1) : p.url;
  const filepath = path.join(process.cwd(), rel || "");
  const ext = path.extname(filepath).toLowerCase();
  let aiRes = null;

  if (ext === ".heic" || ext === ".heif") {
    try {
      const updatedFilepath = filepath + ".jpg";
      const updatedFilename = p.filename + ".jpg";
      let buffer = await fsPromises.readFile(updatedFilepath);
      let form = new FormData();
      form.append("photo", new Blob([buffer]), updatedFilename);

      aiRes = await fetch(`${FACE_API_BASE_URL}/detect-faces`, {
        method: "POST",
        body: form,
      });
    } catch (e) {
      console.error("HEIC.jpg failed for", p._id, e);
      return { ok: false };
    }
  } else {
    try {
      let buffer = await fsPromises.readFile(filepath);
      let filename = p.filename || path.basename(filepath);
      let form = new FormData();
      form.append("photo", new Blob([buffer]), filename);

      aiRes = await fetch(`${FACE_API_BASE_URL}/detect-faces`, {
        method: "POST",
        body: form,
      });
    } catch (e) {
      console.error("processPhoto error", p._id, e);
      return { ok: false };
    }
  }

  if (aiRes === null || !aiRes.ok) {
    console.error(`AI service failed for ${p._id}: ${aiRes?.status}`);
    return { ok: false };
  }

  try {
    const data: any = await aiRes.json();
    const embeddings = data.embeddings || [];

    for (const emb of embeddings) {
      const doc = await FaceEmbedding.create({
        photoId: p._id,
        croppedFaceUrl: emb.faceUrl,
        embedding: emb.descriptor,
        processed: false,
      });
    }

    await Photo.findByIdAndUpdate(p._id, {
      processed: true,
      facesDetected: embeddings.length,
    });

    return { ok: true, faces: embeddings.length };
  } catch (e) {
    console.error("Error saving embeddings for", p._id, e);
    return { ok: false };
  }
}

async function run(concurrency = 3) {
  // console.log("Proccessing image...");
  isImageProccessing = true;
  const photos = await Photo.find({ processed: false })
    .select("_id url filename")
    .limit(100)
    .lean();
  // console.log(`Found ${photos.length} unprocessed photos`);

  let index = 0;
  let inFlight = 0;
  let results: any[] = [];

  return new Promise<void>((resolve) => {
    function next() {
      while (inFlight < concurrency && index < photos.length) {
        const p = photos[index++];
        inFlight++;
        processPhoto(p)
          .then((r) => results.push({ id: p._id, ...r }))
          .catch((e) => results.push({ id: p._id, ok: false, err: e }))
          .finally(() => {
            inFlight--;
            if (index >= photos.length && inFlight === 0) {
              resolve();
            } else {
              next();
            }
          });
      }
    }

    if (photos.length === 0) resolve();
    else next();
  }).then(async () => {
    if (results.length > 0) {
      console.log("Image Processing completed", results);
      await clusterFaces(FACE_API_BASE_URL);
      console.log("Face Cluster Created!");
    }
    isImageProccessing = false;
    // process.exit(0);
  });
}

const concurrency = parseInt(process.argv[2] || "3", 10);

setInterval(() => {
  if (!isImageProccessing) {
    run(concurrency).catch((e) => {
      console.error(e);
      process.exit(1);
    });
  }
}, 4000);
