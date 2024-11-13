import mongoose, { model } from "mongoose";
//Create the Schema for users:
const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { data: Buffer, type: String },
  user_reviews: Number,
  description: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "electronics",
      "tools",
      "sports_equipment",
      "outdoor_gear",
      "music_equipment",
      "party_supplies",
      "vehicles",
      "fashion_accessories",
      "books",
      "furniture",
      "other",
    ],
    required: true,
  },
  price: { type: Number, required: false },
  type: {
    type: String,
    enum: ["daily", "monthly", "hourly"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true, //  Every ad must have a user associated with it
  },
});

//Create the model and export it
export const Ad = mongoose.model("Ad", adSchema);
