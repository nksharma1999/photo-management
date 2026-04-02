import connectDB from "../src/config/db";
import Photo from "../src/model/Photo";
import FaceEmbedding from "../src/model/FaceEmbedding";
import { promises as fsPromises } from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import fetch, { FormData, Blob } from "node-fetch";
import { clusterFaces } from "../src/services/faceClusterService";
import dotenv from 'dotenv';
dotenv.config({path:'../config/.env'});
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

  try {
    let buffer = await fsPromises.readFile(filepath);
    let filename = p.filename || path.basename(filepath);

    let form = new FormData();
    form.append("photo", new Blob([buffer]), filename);

    let aiRes = await fetch(`${FACE_API_BASE_URL}/detect-faces`, {
      method: "POST",
      body: form,
    });
    if (!aiRes.ok) {
      // try conversion for HEIC
      const ext = path.extname(filepath).toLowerCase();
      if (ext === ".heic" || ext === ".heif") {
        const converted = await convertHeicToJpeg(filepath);
        buffer = await fsPromises.readFile(converted);
        filename = path.basename(converted);
        form = new FormData();
        form.append("photo", new Blob([buffer]), filename);
        aiRes = await fetch(`${FACE_API_BASE_URL}/detect-faces`, {
          method: "POST",
          body: form,
        });
      }
    }

    if (!aiRes.ok) {
      console.error(`AI service failed for ${p._id}: ${aiRes.status}`);
      return { ok: false };
    }

    const data: any = await aiRes.json();
    const embeddings = data.embeddings || [];

    // const created: any[] = [];
    for (const emb of embeddings) {
      // if (!Array.isArray(emb)) continue;
      const doc = await FaceEmbedding.create({
        photoId: p._id,
        croppedFaceUrl: emb.faceUrl,
        embedding: emb.descriptor,
        processed: false,
      });
      // created.push(doc);
    }

    await Photo.findByIdAndUpdate(p._id, {
      processed: true,
      facesDetected: embeddings.length,
    });

    return { ok: true, faces: embeddings.length };
  } catch (err) {
    console.error("processPhoto error", p._id, err);
    return { ok: false };
  }
}

async function run(concurrency = 3) {
  console.log("Proccessing image...");
  isImageProccessing = true;
  const photos = await Photo.find({ processed: false })
    .select("_id url filename")
    .limit(100)
    .lean();
  console.log(`Found ${photos.length} unprocessed photos`);

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
    console.log("Image Processing completed", results);
    if(results.length>0){
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
