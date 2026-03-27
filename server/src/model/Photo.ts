import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  filename: String,
  url: String,
  thumbnail: String,

  location: String,
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