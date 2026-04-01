const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: [true, "Please specify department"],
      enum: [
        "Computer Science",
        "IT",
        "Electronics",
        "Electrical",
        "Mechanical",
        "Civil",
        "AI/ML",
        "Chemical",
      ],
    },
    cgpa: {
      type: Number,
      required: [true, "Please provide CGPA"],
      min: [0, "CGPA cannot be negative"],
      max: [10, "CGPA cannot exceed 10"],
    },
    backlogs: {
      type: Number,
      required: [true, "Please specify number of backlogs"],
      min: [0, "Backlogs cannot be negative"],
      default: 0,
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number"],
    },
    graduationYear: {
      type: Number,
      required: [true, "Please specify graduation year"],
      min: [2020, "Invalid graduation year"],
      max: [2030, "Invalid graduation year"],
    },
    skills: {
      type: [String],
      default: [],
    },
    resumeUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
