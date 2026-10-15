import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    agentName: {
      type: String,
      required: true,
      trim: true,
    },
    agencyId: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

agentSchema.index({ agentName: 1 });

export default mongoose.model("Agent", agentSchema);