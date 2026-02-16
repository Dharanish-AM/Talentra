const mongoose = require("mongoose");

const jobDriveSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide job title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide job description"],
    },
    role: {
      type: String,
      required: [true, "Please specify role"],
    },
    package: {
      type: String,
      required: [true, "Please specify package"],
    },
    location: {
      type: String,
      required: [true, "Please specify location"],
    },
    eligibility: {
      minCgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      allowedDepartments: {
        type: [String],
        required: true,
      },
      maxBacklogs: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    deadline: {
      type: Date,
      required: [true, "Please specify application deadline"],
    },
    driveDate: {
      type: Date,
      required: [true, "Please specify drive date"],
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

jobDriveSchema.virtual("applicantCount", {
  ref: "Application",
  localField: "_id",
  foreignField: "driveId",
  count: true,
});

module.exports = mongoose.model("JobDrive", jobDriveSchema);
