const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const canvas = require("canvas");
const faceapi = require("face-api.js");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

// Load models once at startup
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
}
loadModels();

// Known faces array
let knownFaces = []; // { id?, name, descriptor }

function normalizeDescriptorToArray(d) {
  if (!d) return null;
  if (Array.isArray(d)) return d;
  if (d instanceof Float32Array || d instanceof Float64Array || d instanceof Int8Array || d instanceof Uint8Array) return Array.from(d);
  if (typeof d === 'object') {
    // numeric-keyed object: { '0': val, '1': val, ... }
    const keys = Object.keys(d);
    const numericKeys = keys.filter((k) => /^\d+$/.test(k));
    if (numericKeys.length === keys.length && numericKeys.length > 0) {
      const maxIdx = Math.max(...numericKeys.map((k) => parseInt(k, 10)));
      const out = new Array(maxIdx + 1).fill(0);
      for (const k of numericKeys) {
        const idx = parseInt(k, 10);
        const v = d[k];
        if (typeof v === 'number' && idx >= 0) out[idx] = v;
      }
      return out;
    }
    if (Array.isArray(d.data)) return d.data;
    const vals = Object.values(d).filter((v) => typeof v === 'number');
    if (vals.length) return vals;
  }
  return null;
}

function toFloat32Array128(d) {
  const arr = normalizeDescriptorToArray(d);
  if (!arr) return null;
  const target = 128;
  const out = new Float32Array(target);
  for (let i = 0; i < target; i++) out[i] = i < arr.length ? arr[i] : 0;
  return out;
}

function findBestMatch(queryDescriptor, knownFacesParam, threshold = 0.5) {
  const pool = Array.isArray(knownFacesParam) ? knownFacesParam : knownFaces;
  const qArr = toFloat32Array128(queryDescriptor);
  if (!qArr) return { name: "Not Found", distance: Infinity };

  let bestMatch = { name: "Not Found", distance: Infinity };
  let bestId = undefined;

  for (const person of pool) {
    if (!person || !person.descriptor) continue;
    const pArr = toFloat32Array128(person.descriptor);
    if (!pArr) continue;
    try {
      const distance = faceapi.euclideanDistance(qArr, pArr);
      if (distance < bestMatch.distance) {
        bestMatch = { name: person.name || "Not Found", distance };
        bestId = person.id || person._id || undefined;
      }

      console.log(`Compared with ${person.name || "unknown"}, distance: ${distance}`);

    } catch (e) {
      console.warn('euclideanDistance error, skipping person:', e && e.message);
      continue;
    }
  }
  if (bestMatch.distance < threshold) return { personId: bestId, name: bestMatch.name, distance: bestMatch.distance };
  return { name: "Not Found", distance: bestMatch.distance };
}

function addToKnownFaces(
  newDescriptor,
  name = `Person${knownFaces.length + 1}`,
  threshold = 0.6,
) {
  let isKnown = false;

  for (const person of knownFaces) {
    const distance = faceapi.euclideanDistance(
      newDescriptor,
      person.descriptor,
    );
    if (distance < threshold) {
      isKnown = true;
      break;
    }
  }

  if (!isKnown) {
    knownFaces.push({ name, descriptor: newDescriptor });
    console.log(
      `New face added: ${name}. Total known faces: ${knownFaces.length}`,
    );
  } else {
    console.log("Face already known, not added.");
  }
}

// Endpoint: detect faces and return cropped images + embeddings
app.post("/detect-faces", upload.single("photo"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filepath = file.path;
    const img = await canvas.loadImage(filepath);

    const detections = await faceapi
      .detectAllFaces(
        img,
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.25 }),
      )
      .withFaceLandmarks()
      .withFaceDescriptors();

    const results = [];

    detections.forEach((det, i) => {
      const { x, y, width, height } = det.detection.box;

      // Crop face
      const faceCanvas = canvas.createCanvas(width, height);
      const faceCtx = faceCanvas.getContext("2d");
      faceCtx.drawImage(img, x, y, width, height, 0, 0, width, height);

      // Save cropped face temporarily
      const outPath = path.join(__dirname, `face${i + 1}.png`);
      fs.writeFileSync(outPath, faceCanvas.toBuffer("image/png"));

      // Add to knownFaces if new
      //   addToKnownFaces(det.descriptor);

      results.push(det.descriptor);
    //   console.log(det.descriptor);
    });
    res.json({
        facesDetected: detections.length,
        embeddings: results,
    });
    
    fs.unlinkSync(filepath); // Clean up uploaded file
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Face detection failed" });
  }
});

// Endpoint: match faces against knownFaces
app.post("/match-faces", async (req, res) => {
  try {
    const { query, knownFaces, threshold } = req.body;
    // console.log(req.body);
    if (!query) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const match = findBestMatch(query, knownFaces, threshold);
    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing match request");
  }
});

app.listen(4001, () => {
  console.log("Face API server running on http://localhost:4001");
});
