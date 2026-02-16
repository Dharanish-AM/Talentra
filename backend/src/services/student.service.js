const StudentProfile = require("../models/StudentProfile");
const JobDrive = require("../models/JobDrive");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const {
  checkEligibility,
  filterEligibleDrives,
} = require("./eligibility.service");

const getProfile = async (userId) => {
  const profile = await StudentProfile.findOne({ userId }).populate(
    "userId",
    "name email",
  );

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return profile;
};

const updateProfile = async (userId, profileData) => {
  let profile = await StudentProfile.findOne({ userId });

  if (!profile) {
    profile = await StudentProfile.create({ userId, ...profileData });
  } else {
    profile = await StudentProfile.findOneAndUpdate({ userId }, profileData, {
      new: true,
      runValidators: true,
    });
  }

  return profile;
};

const uploadResume = async (userId, filePath) => {
  const profile = await StudentProfile.findOneAndUpdate(
    { userId },
    { resumeUrl: filePath },
    { new: true, runValidators: true },
  );

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return profile;
};

const getEligibleDrives = async (userId) => {
  const allDrives = await JobDrive.find({ status: "active" }).populate(
    "companyId",
    "name logo",
  );
  const eligibleDrives = await filterEligibleDrives(userId, allDrives);
  return eligibleDrives;
};

const applyToDrive = async (userId, driveId) => {
  const user = await User.findById(userId);
  const drive = await JobDrive.findById(driveId);

  if (!drive) {
    throw new ApiError(404, "Job drive not found");
  }

  const profile = await StudentProfile.findOne({ userId });
  if (!profile) {
    throw new ApiError(400, "Please complete your profile before applying");
  }

  const eligibilityCheck = checkEligibility(profile, drive.eligibility);
  if (!eligibilityCheck.eligible) {
    throw new ApiError(400, `Not eligible: ${eligibilityCheck.reason}`);
  }

  const existingApplication = await Application.findOne({
    studentId: userId,
    driveId,
  });
  if (existingApplication) {
    throw new ApiError(400, "You have already applied to this drive");
  }

  const application = await Application.create({
    studentId: userId,
    studentName: user.name,
    driveId,
    driveName: drive.title,
    companyName: drive.companyName,
    status: "applied",
  });

  return application;
};

const getMyApplications = async (userId) => {
  const applications = await Application.find({ studentId: userId })
    .populate("driveId", "title companyName package location driveDate")
    .sort("-appliedAt");

  return applications;
};

const getMyInterviews = async (studentId) => {
  const interviews = await Interview.find({ studentId })
    .populate("driveId", "companyName role")
    .sort("date time");

  return interviews.map((interview) => ({
    ...interview.toObject(),
    companyName: interview.driveId?.companyName || "Unknown",
    role: interview.driveId?.role || "Unknown",
  }));
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  getEligibleDrives,
  applyToDrive,
  getMyApplications,
  getMyInterviews,
};
