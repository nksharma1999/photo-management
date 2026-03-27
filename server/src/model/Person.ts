import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: String,
  representative: [Number],
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo"
    }
  ]
});

export default mongoose.model("Person", personSchema);