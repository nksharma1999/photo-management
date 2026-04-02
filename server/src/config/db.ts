import mongoose from "mongoose";

const connectDB = async (url:string | undefined) => {
  try {
    if (!url) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }
    await mongoose.connect(url);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err);
    process.exit(1);
  }
};

export default connectDB;