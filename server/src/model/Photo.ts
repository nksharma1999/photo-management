import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  filename: String,
  url: String,
  thumbnail: String,

  location: String,
  // whether photo has been processed by the AI worker
  processed: { type: Boolean, default: false },
  // number of faces detected (filled by worker)
  facesDetected: { type: Number, default: 0 },
  isFav: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },

  dateTaken: Date,
  camera: String,

  latitude: Number,
  longitude: Number,

  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album"
    }
  ],

  people: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person"
    }
  ]
});

export default mongoose.model("Photo", photoSchema);