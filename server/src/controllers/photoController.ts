import exifr from "exifr";
import db from "../config/db";
import sharp from "sharp";
import { getImageMetadata } from "../services/metadataService";

export const uploadPhoto = async (req: any, res: any) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filepath = file.path;

    const thumbPath = `thumbnails/${file.filename}`;
    await sharp(filepath).resize(300).toFile(thumbPath);

    const metadata = await getImageMetadata(filepath);

    const dateTaken = metadata?.DateTimeOriginal || null;
    const camera = metadata?.Model || null;
    const lat = metadata?.latitude || null;
    const lng = metadata?.longitude || null;
    const filename = file.filename;
    const url = `/uploads/${filename}`;
    const thumbnail = `/thumbnails/${file.filename}`;

    const query = `
      INSERT INTO photos
      (filename,url,thumbnail,date_taken,camera,latitude,longitude)
      VALUES (?,?,?,?,?,?)
    `;

    // await db.execute(query, [filename, url,thumbnail, dateTaken, camera, lat, lng]);

    res.json({
      message: "Photo uploaded",
      url,
      thumbnail,
      metadata,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getPhotos = async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const offset = (page - 1) * limit;

    const [rows] = await db.query(
      `SELECT * FROM photos
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const toggleFavorite = async (req: any, res: any) => {
  const id = req.params.id;

  const query = `
    UPDATE photos
    SET isFav = NOT isFav
    WHERE id = ?
  `;

  await db.execute(query, [id]);

  res.json({ message: "Favorite updated" });
};

export const deletePhoto = async (req: any, res: any) => {
  const id = req.params.id;

  await db.execute("DELETE FROM photos WHERE id=?", [id]);

  res.json({ message: "Photo deleted" });
};

export const getPhotoCount = async(req:any,res:any)=>{

 const [rows]:any = await db.query(
   "SELECT COUNT(*) as total FROM photos"
 )

 res.json(rows[0])

}
