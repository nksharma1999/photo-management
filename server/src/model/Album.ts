import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },

  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo"
    }
  ]
});

export default mongoose.model("Album", albumSchema);