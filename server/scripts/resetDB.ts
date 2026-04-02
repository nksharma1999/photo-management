import Photo from "../src/model/Photo";
import Person from "../src/model/Person";
import FaceEmbedding from "../src/model/FaceEmbedding";
import Album from "../src/model/Album";
import dotenv from 'dotenv';
import connectDB from "../src/config/db";
dotenv.config({path:'./config/.env'});
const MONGODB_URL = process.env.MONGODB_URL;
connectDB(MONGODB_URL);
const resetDatabase = async () => {
  try {

    await Photo.deleteMany({});
    await Person.deleteMany({});
    await FaceEmbedding.deleteMany({});
    await Album.deleteMany({});
    console.log("🔥 All data deleted");
    process.exit(1);

  } catch (err) {
    console.error("Reset error:", err);
  }
};

resetDatabase();