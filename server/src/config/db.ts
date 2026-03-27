import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://nksharmassm1999:Nand%40%231234@expensecluster.abmqlet.mongodb.net/?appName=ExpenseCluster");

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err);
    process.exit(1);
  }
};

export default connectDB;