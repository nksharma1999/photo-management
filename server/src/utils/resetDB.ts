import mongoose from "mongoose";
import Photo from "../model/Photo";
import Person from "../model/Person";
import FaceEmbedding from "../model/FaceEmbedding";

export const resetDatabase = async () => {
  try {

    await Photo.deleteMany({});
    await Person.deleteMany({});
    await FaceEmbedding.deleteMany({});

    console.log("🔥 All data deleted");

  } catch (err) {
    console.error("Reset error:", err);
  }
};