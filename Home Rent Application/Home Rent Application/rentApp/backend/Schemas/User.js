import mongoose, { model } from "mongoose";
//Create the Schema for users:
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5.0 },
});

//Create the model and export it
export const User = mongoose.model("User", userSchema);
