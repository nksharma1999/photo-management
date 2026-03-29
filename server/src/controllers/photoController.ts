import exifr from "exifr";
import db from "../config/db";
import fs from "fs";
import sharp from "sharp";
import fetch, { FormData, Blob } from "node-fetch";
import { getImageMetadata } from "../services/metadataService";
import Photo from "../model/Photo";
import FaceEmbedding from "../model/FaceEmbedding";
import Album from "../model/Album";
import Person from "../model/Person";

export const uploadPhoto = async (req: any, res: any) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filepath = file.path;
    // ✅ 1. Generate thumbnail
    const thumbPath = `thumbnails/${file.filename}`;
    await sharp(filepath).resize(300).toFile(thumbPath);

    // ✅ 2. Extract metadata
    const metadata = await getImageMetadata(filepath);
    // ✅ 3. Save photo in DB
    const photo = await Photo.create({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      thumbnail: `/thumbnails/${file.filename}`,
      dateTaken: metadata?.DateTimeOriginal,
      camera: metadata?.Model,
      latitude: metadata?.latitude,
      longitude: metadata?.longitude,
    });

    // ✅ 4. Call AI Service for face detection
    let embeddings: number[][] = [];

    try {
      const buffer = fs.readFileSync(filepath);
      const form = new FormData();
      form.append("image", new Blob([buffer]), file.filename);
      const response = await fetch("http://localhost:4001/detect-faces", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      const data: any = await response.json();
      // console.log("AI Service Response:", data);

      embeddings = data.embeddings || [];
    } catch (err) {
      console.error("AI Service Error:", err);
    }
    // ✅ 5. Save embeddings in DB
    for (const emb of embeddings) {
      await FaceEmbedding.create({
        photoId: photo._id,
        embedding: emb,
      });
    }
    // ✅ 6. Response
    res.json({
      message: "Photo uploaded",
      photo,
      facesDetected: embeddings.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const getPhotos = async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const offset = (page - 1) * limit;

    const photos = await Photo.find().sort({ createdAt: -1 }).limit(50);

    res.json(photos);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getRecentPhotos = async (req: any, res: any) => {
  try {
    const photos = await Photo.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("thumbnail url -_id");

    const urls = photos.map((p: any) => p.thumbnail || p.url).filter(Boolean);

    res.json(urls);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getPhotosByDate = async (req: any, res: any) => {
  try {
    const rows: any = await Photo.aggregate([
      {
        $addFields: {
          dateForGroup: { $ifNull: ["$dateTaken", "$createdAt"] },
        },
      },
      {
        $project: {
          url: 1,
          thumbnail: 1,
          isFav:1,
          createdAt: 1,
          dateStr: {
            $dateToString: { format: "%Y-%m-%d", date: "$dateForGroup" },
          },
        },
      },
      { $sort: { dateStr: -1, createdAt: -1 } },
      {
        $group: {
          _id: "$dateStr",
          photos: {
            $push: { _id: "$_id", url: "$url", thumbnail: "$thumbnail", isFav: "$isFav", createdAt: "$createdAt" },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const result = rows.map((r: any) => ({ date: r._id, photos: r.photos }));
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const toggleFavorite = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const { favorite } = req.body;
    await Photo.findByIdAndUpdate(id, { isFav: favorite });

    res.json({ message: "Favorite updated" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deletePhoto = async (req: any, res: any) => {
  const id = req.params.id;

  // await db.execute("DELETE FROM photos WHERE id=?", [id]);

  res.json({ message: "Photo deleted" });
};

// export const getPhotoCount = async(req:any,res:any)=>{

// //  const [rows]:any = await db.query(
// //    "SELECT COUNT(*) as total FROM photos"
// //  )

// //  res.json(rows[0])

// }

export const addToAlbum = async (req: any, res: any) => {
  const { albumId, photoId } = req.body;

  await Album.findByIdAndUpdate(albumId, {
    $addToSet: { photos: photoId },
  });

  await Photo.findByIdAndUpdate(photoId, {
    $addToSet: { albums: albumId },
  });

  res.json({ message: "Added to album" });
};
