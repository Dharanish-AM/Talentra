const Interview = require("../models/Interview");
const Application = require("../models/Application");
const JobDrive = require("../models/JobDrive");
const Company = require("../models/Company");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const getCandidates = async () => {
  const interviews = await Interview.find()
    .populate("studentId", "name email")
    .populate("driveId", "title companyName role")
    .sort("date");

  return interviews.map((interview) => ({
    ...interview.toObject(),
    studentName: interview.studentId?.name || "Unknown",
    studentEmail: interview.studentId?.email || "Unknown",
    driveTitle: interview.driveId?.title || "Unknown Drive",
    companyName: interview.driveId?.companyName || "Unknown Company",
    role: interview.driveId?.role || "Unknown Role",
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

const createDrive = async (driveData, recruiterId) => {
  const recruiter = await User.findById(recruiterId);
  if (!recruiter.companyId) {
    throw new ApiError(400, "Recruiter is not associated with any company");
  }

  const company = await Company.findById(recruiter.companyId);
  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  const drive = await JobDrive.create({
    ...driveData,
    companyId: company._id,
    companyName: company.name,
    createdBy: recruiterId,
  });

  return drive;
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
  createDrive,
};
