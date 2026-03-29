import sharp from "sharp";
import { getImageMetadata } from "../services/metadataService";
import Photo from "../model/Photo";
import Album from "../model/Album";
import Person from "../model/Person";
import { promises as fsPromises } from "fs";
import path from "path";
import fetch, { FormData, Blob } from "node-fetch";
import FaceEmbedding from "../model/FaceEmbedding";
import { execFileSync } from "child_process";

export const uploadPhoto = async (req: any, res: any) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filepath = file.path;
    // 1. Generate thumbnail (try sharp; if HEIC fails, try external converter)
    const thumbPath = `thumbnails/${file.filename}`;
    let thumbCreated = false;
    try {
      await sharp(filepath).resize(300).toFile(thumbPath);
      thumbCreated = true;
    } catch (err: any) {
      console.warn("sharp thumbnail creation failed:", err.message || err);
      const ext = path.extname(filepath).toLowerCase();
      if (ext === ".heic" || ext === ".heif") {
        try {
          // try heif-convert (from libheif)
          const converted = `${filepath}.jpg`;
          try {
            execFileSync("heif-convert", [filepath, converted]);
          } catch (e1) {
            // fallback to ImageMagick `magick` if installed
            execFileSync("magick", [filepath, converted]);
          }

          await sharp(converted).resize(300).toFile(thumbPath);
          thumbCreated = true;
          await fsPromises.unlink(converted).catch(() => {});
        } catch (e2: any) {
          console.error("HEIC conversion failed:", e2.message || e2);
        }
      }
    }

    // 2. Extract metadata
    const metadata = await getImageMetadata(filepath);

    // 3. Save photo in DB and mark as not processed so the AI worker can pick it up later
    const photo = await Photo.create({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      thumbnail: `/thumbnails/${file.filename}`,
      dateTaken: metadata?.DateTimeOriginal,
      camera: metadata?.Model,
      latitude: metadata?.latitude,
      longitude: metadata?.longitude,
      processed: false,
      facesDetected: 0,
    });

    // Don't call AI here — background worker should process unprocessed photos.
    // Return immediately so uploads are fast.
    res.json({ message: "Photo uploaded", photo, processingQueued: true });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const getUnprocessedPhotos = async (req: any, res: any) => {
  try {
    const photos = await Photo.find({ processed: false }).select("_id url thumbnail filename").sort({ createdAt: 1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const processAllUnprocessed = async (req: any, res: any) => {
  try {
    const photos = await Photo.find({ processed: false }).select("_id url filename").sort({ createdAt: 1 }).lean();

    // start background processing (fire-and-forget)
    (async () => {
      for (const p of photos) {
        try {
          const rel = p.url && p.url.startsWith("/") ? p.url.slice(1) : p.url;
          const filepath = path.join(process.cwd(), rel || "");
          const buffer = await fsPromises.readFile(filepath);
          const form = new FormData();
          form.append("image", new Blob([buffer]), p.filename || "image.jpg");

          const aiRes = await fetch("http://localhost:4001/detect-faces", { method: "POST", body: form });
          if (!aiRes.ok) {
            console.error(`AI service failed for ${p._id}: ${aiRes.status}`);
            continue;
          }

          const data: any = await aiRes.json();
          const embeddings = data.embeddings || [];

          const created: any[] = [];
          for (const emb of embeddings) {
            if (!Array.isArray(emb)) continue;
            const doc = await FaceEmbedding.create({ photoId: p._id, embedding: emb, processed: false });
            created.push(doc);
          }

          await Photo.findByIdAndUpdate(p._id, { processed: true, facesDetected: created.length });
        } catch (err) {
          console.error("Error processing photo", p._id, err);
        }
      }
    })();

    res.json({ message: "Processing started", queued: photos.length });
  } catch (err) {
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
