const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide company name"],
      trim: true,
      unique: true,
    },
    logo: {
      type: String,
    },
    industry: {
      type: String,
      required: [true, "Please specify industry"],
    },
    website: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Please provide company description"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Company", companySchema);
