// src/models/lob.model.js
import mongoose from "mongoose";

const lobSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

export default mongoose.model("LOB", lobSchema);