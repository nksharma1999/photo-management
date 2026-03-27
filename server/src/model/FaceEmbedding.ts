import mongoose from "mongoose";

const faceSchema = new mongoose.Schema({
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo",
    required: true
  },
  processed: { type: Boolean, default: false },
  embedding: {
    type: [Number] // array of numbers
  }
});

export default mongoose.model("FaceEmbedding", faceSchema);