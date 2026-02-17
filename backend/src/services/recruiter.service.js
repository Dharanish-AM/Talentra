const Interview = require("../models/Interview");
const Application = require("../models/Application");
const ApiError = require("../utils/ApiError");

const getCandidates = async () => {
  const interviews = await Interview.find()
    .populate("studentId", "name email")
    .populate("driveId", "title companyName")
    .sort("date");

  return interviews.map((interview) => ({
    ...interview.toObject(),
    studentName: interview.studentId?.name || "Unknown",
    studentEmail: interview.studentId?.email || "Unknown",
    driveTitle: interview.driveId?.title || "Unknown Drive",
    companyName: interview.driveId?.companyName || "Unknown Company",
  }));
};

const getShortlistedApplications = async () => {
  const applications = await Application.find({
    status: { $in: ["shortlisted", "interview"] },
  })
    .populate("studentId", "name email")
    .populate("driveId", "companyName role")
    .sort("-updatedAt");

  return applications.map((app) => ({
    ...app.toObject(),
    studentName: app.studentId?.name || "Unknown",
    driveName: app.driveId?.role || "Unknown Drive",
    companyName: app.driveId?.companyName || "Unknown Company",
  }));
};

const submitFeedback = async (interviewId, feedbackData) => {
  const { feedback, result } = feedbackData;

  const interview = await Interview.findByIdAndUpdate(
    interviewId,
    { feedback, result },
    { new: true, runValidators: true },
  )
    .populate("studentId", "name email")
    .populate("driveId", "title companyName");

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (result === "selected") {
    await Application.findOneAndUpdate(
      { studentId: interview.studentId, driveId: interview.driveId },
      { status: "selected", updatedAt: Date.now() },
    );
  } else if (result === "rejected") {
    await Application.findOneAndUpdate(
      { studentId: interview.studentId, driveId: interview.driveId },
      { status: "rejected", updatedAt: Date.now() },
    );
  }

  return interview;
};

const updateCandidateResult = async (interviewId, result) => {
  const interview = await Interview.findByIdAndUpdate(
    interviewId,
    { result },
    { new: true, runValidators: true },
  )
    .populate("studentId", "name email")
    .populate("driveId", "title companyName");

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (result === "selected") {
    await Application.findOneAndUpdate(
      { studentId: interview.studentId, driveId: interview.driveId },
      { status: "selected", updatedAt: Date.now() },
    );
  } else if (result === "rejected") {
    await Application.findOneAndUpdate(
      { studentId: interview.studentId, driveId: interview.driveId },
      { status: "rejected", updatedAt: Date.now() },
    );
  }

  return interview;
};

module.exports = {
  getCandidates,
  getShortlistedApplications,
  submitFeedback,
  updateCandidateResult,
};
