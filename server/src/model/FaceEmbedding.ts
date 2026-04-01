import mongoose from "mongoose";

const faceSchema = new mongoose.Schema({
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo",
    required: true
  },
  croppedFaceUrl: String,
  processed: { type: Boolean, default: false },
  embedding: {
    type: Map, 
    of: Number
  }
});

export default mongoose.model("FaceEmbedding", faceSchema);