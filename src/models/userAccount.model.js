import mongoose from "mongoose";

const userAccountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
      trim: true,
    },
    accountType: {
      type: String,
      default: null,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

userAccountSchema.index(
  { accountName: 1, userId: 1, accountType: 1 },
  { unique: true }
);

export default mongoose.model("UserAccount", userAccountSchema);