import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    coverMessage: {
      type: String,
      required: [true, "Cover message is required"],
      trim: true,
    },
    cvLink: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);

export default JobApplication;
