const Interview = require("../models/Interview");
const Application = require("../models/Application");
const ApiError = require("../utils/ApiError");

const getCandidates = async () => {
  const interviews = await Interview.find()
    .populate("studentId", "name email")
    .populate("driveId", "title companyName")
    .sort("date");

  return interviews;
};

const submitFeedback = async (interviewId, feedbackData) => {
  const { feedback, result } = feedbackData;

  const interview = await Interview.findByIdAndUpdate(
    interviewId,
    { feedback, result },
    { new: true, runValidators: true },
  );

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
  );

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
  submitFeedback,
  updateCandidateResult,
};
