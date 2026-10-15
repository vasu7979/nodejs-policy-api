import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    policyStartDate: {
      type: Date,
      default: null,
    },
    policyEndDate: {
      type: Date,
      default: null,
    },
    policyMode: {
      type: String,
      default: null,
      trim: true,
    },
    premiumAmountWritten: {
      type: Number,
      default: null,
    },
    premiumAmount: {
      type: Number,
      default: null,
    },
    policyType: {
      type: String,
      default: null,
      trim: true,
    },
    producer: {
      type: String,
      default: null,
      trim: true,
    },
    csr: {
      type: String,
      default: null,
      trim: true,
    },
    hasActiveClientPolicy: {
      type: Boolean,
      default: null,
    },
    policyCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LOB",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Policy", policySchema);