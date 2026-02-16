const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobDrive",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: [true, "Please specify interview date"],
    },
    time: {
      type: String,
      required: [true, "Please specify interview time"],
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      required: [true, "Please specify interview mode"],
    },
    link: {
      type: String,
    },
    feedback: {
      type: String,
    },
    result: {
      type: String,
      enum: ["pending", "selected", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Interview", interviewSchema);
