import mongoose from "mongoose";

const scheduledPostSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ScheduledPost", scheduledPostSchema);