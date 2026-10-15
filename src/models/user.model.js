import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    applicantId: {
      type: String,
      default: null,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      default: null,
    },
    address: {
      type: String,
      default: null,
      trim: true,
    },
    city: {
      type: String,
      default: null,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },
    state: {
      type: String,
      default: null,
      trim: true,
    },
    zipCode: {
      type: String,
      default: null,
      trim: true,
    },
    email: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      default: null,
      trim: true,
    },
    userType: {
      type: String,
      default: null,
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

userSchema.index({ applicantId: 1 });

export default mongoose.model("User", userSchema);