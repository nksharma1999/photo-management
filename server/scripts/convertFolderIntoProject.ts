import fs from "fs";
import path from "path";
import Photo from "../src/model/Photo";
import sharp from "sharp";
import fetch from "node-fetch";
import exifr from "exifr";
import https from "https";
import { execFileSync } from "child_process";
import dotenv from "dotenv";
import connectDB from "../src/config/db";
import process from "process";
dotenv.config({ path: "./config/.env" });
const MONGODB_URL = process.env.MONGODB_URL;
const BULKFILE_PATH = process.env.BULKFILE_PATH;
connectDB(MONGODB_URL);

const getImageMetadata = async (filepath:string) =>{
    const metadata = await exifr.parse(filepath);
    return metadata;
}

async function getCity(lat: number, lon: number) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    const agent = new https.Agent({ rejectUnauthorized: false });
    const res = await fetch(url, { method: "GET" , agent });
    if (!res.ok) {
      console.error("HTTP error city name not found:", res.status);
      return null;
    }
    const data: any = await res.json();
    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.state;
    return city;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

async function processSinglePhoto(filepath: string) {
  try {
    const filename = path.basename(filepath);
    // 👉 Step 1: Copy original to uploads folder
    const uploadPath = path.join("uploads", filename);

    await fs.promises.copyFile(filepath, uploadPath);
    
    let needFileDelete = false;

    // 1. Thumbnail
    const thumbPath = `thumbnails/${filename}`;
    let thumbCreated = false;

    try {
      await sharp(filepath).resize(300).toFile(thumbPath);
      thumbCreated = true;
    } catch (err: any) {
      const ext = path.extname(filepath).toLowerCase();

      if (ext === ".heic" || ext === ".heif") {
        try {
          const converted = `${uploadPath}.jpg`;

          try {
            execFileSync("heif-convert", [uploadPath, converted]);
          } catch {
            execFileSync("magick", [uploadPath, converted]);
          }

          await sharp(converted).resize(300).toFile(thumbPath);
          thumbCreated = true;
          needFileDelete = true;
        } catch (e2: any) {
          console.error("HEIC conversion failed:", e2.message);
        }
      }
    }

    // 2. Metadata
    const metadata = await getImageMetadata(filepath);
    const city = await getCity(metadata?.latitude, metadata?.longitude);
    // console.log({
    //   filename,
    //   url: `/uploads/${filename}`,
    //   thumbnail: `/thumbnails/${filename}`,
    //   dateTaken: metadata?.DateTimeOriginal,
    //   camera: metadata?.Model,
    //   latitude: metadata?.latitude,
    //   longitude: metadata?.longitude,
    //   processed: false,
    //   facesDetected: 0,
    //   location: city,
    // })
    // 3. Save DB
    const photo = await Photo.create({
      filename,
      url: `/uploads/${filename}`,
      thumbnail: `/thumbnails/${filename}`,
      dateTaken: metadata?.DateTimeOriginal,
      camera: metadata?.Model,
      latitude: metadata?.latitude,
      longitude: metadata?.longitude,
      processed: false,
      facesDetected: 0,
      location: city,
    });

    if (needFileDelete) {
      await fs.promises.unlink(uploadPath).catch(() => {});
    }

    console.log(`✅ Processed: ${filename}`);
  } catch (err) {
    console.error("❌ Error processing:", filepath, err);
  }
}

export async function processFolder(folderPath: string | undefined) {
  if (!folderPath) {
    console.error("Folder path is not defined");
    process.exit(1);
  }

  try {
    const files = await fs.promises.readdir(folderPath);

    // Filter only images
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".heic", ".heif"].includes(ext);
    });

    console.log(`📁 Found ${imageFiles.length} images`);

    // 👉 Process ONE BY ONE (important)
    for (const file of imageFiles) {
      const fullPath = path.join(folderPath, file);

      await processSinglePhoto(fullPath); // sequential
    }

    console.log("🎉 Folder processing completed");
  } catch (err) {
    console.error("Folder processing error:", err);
  }
}

processFolder(BULKFILE_PATH);