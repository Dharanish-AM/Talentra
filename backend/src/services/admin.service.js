const Company = require("../models/Company");
const JobDrive = require("../models/JobDrive");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const StudentProfile = require("../models/StudentProfile");
const ApiError = require("../utils/ApiError");

const getAllCompanies = async () => {
  return await Company.find().sort("-createdAt");
};

const createCompany = async (companyData, adminId) => {
  const company = await Company.create({
    ...companyData,
    createdBy: adminId,
  });
  return company;
};

const updateCompany = async (companyId, companyData) => {
  const company = await Company.findByIdAndUpdate(companyId, companyData, {
    new: true,
    runValidators: true,
  });

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return company;
};

const deleteCompany = async (companyId) => {
  const company = await Company.findByIdAndDelete(companyId);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return company;
};

const getAllDrives = async () => {
  const drives = await JobDrive.find()
    .populate("companyId", "name logo")
    .sort("-createdAt");

  const drivesWithCount = await Promise.all(
    drives.map(async (drive) => {
      const count = await Application.countDocuments({ driveId: drive._id });
      return {
        ...drive.toObject(),
        applicantCount: count,
      };
    }),
  );

  return drivesWithCount;
};

const createDrive = async (driveData, adminId) => {
  const company = await Company.findById(driveData.companyId);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  const drive = await JobDrive.create({
    ...driveData,
    companyName: company.name,
    createdBy: adminId,
  });

  return drive;
};

const updateDrive = async (driveId, driveData) => {
  const drive = await JobDrive.findByIdAndUpdate(driveId, driveData, {
    new: true,
    runValidators: true,
  });

  if (!drive) {
    throw new ApiError(404, "Job drive not found");
  }

  return drive;
};

const deleteDrive = async (driveId) => {
  const drive = await JobDrive.findByIdAndDelete(driveId);

  if (!drive) {
    throw new ApiError(404, "Job drive not found");
  }

  return drive;
};

const getDriveApplicants = async (driveId) => {
  const applications = await Application.find({ driveId })
    .populate("studentId", "name email")
    .sort("-appliedAt");

  const applicantsWithProfiles = await Promise.all(
    applications.map(async (app) => {
      const profile = await StudentProfile.findOne({ userId: app.studentId });
      return {
        ...app.toObject(),
        profile,
      };
    }),
  );

  return applicantsWithProfiles;
};

const shortlistApplicants = async (applicationIds) => {
  const result = await Application.updateMany(
    { _id: { $in: applicationIds } },
    { status: "shortlisted", updatedAt: Date.now() },
  );

  return result;
};

const rejectApplicant = async (applicationId) => {
  const result = await Application.findByIdAndUpdate(
    applicationId,
    { status: "rejected", updatedAt: Date.now() },
    { new: true },
  );

  if (!result) {
    throw new ApiError(404, "Application not found");
  }

  return result;
};

const scheduleInterviews = async (interviewData) => {
  const interviews = await Interview.insertMany(interviewData);

  const applicationIds = interviewData.map((i) => i.applicationId);
  await Application.updateMany(
    { _id: { $in: applicationIds } },
    { status: "interview", updatedAt: Date.now() },
  );

  return interviews;
};

const getAllInterviews = async () => {
  const interviews = await Interview.find()
    .populate("driveId", "companyName role title")
    .sort("date time");

  return interviews.map((interview) => ({
    ...interview.toObject(),
    companyName: interview.driveId?.companyName || "Unknown",
    role: interview.driveId?.role || "Unknown",
    driveTitle: interview.driveId?.title || "Unknown Drive",
  }));
};

const releaseOffers = async (applicationIds) => {
  const result = await Application.updateMany(
    { _id: { $in: applicationIds } },
    { status: "offer", updatedAt: Date.now() },
  );

  return result;
};

const getAllApplications = async () => {
  const applications = await Application.find()
    .populate("studentId", "name email")
    .populate("driveId", "companyName role")
    .sort("-appliedAt");

  /* 
     We need to map the result to match the frontend Application type 
     which expects flattened structure like studentName, driveName, etc.
  */
  return applications.map((app) => ({
    ...app.toObject(),
    studentName: app.studentId?.name || "Unknown",
    studentEmail: app.studentId?.email || "Unknown",
    driveName: app.driveId?.role || "Unknown Drive",
    companyName: app.driveId?.companyName || "Unknown Company",
  }));
};

const getAnalytics = async () => {
  const totalCompanies = await Company.countDocuments();
  const totalDrives = await JobDrive.countDocuments();
  const totalApplications = await Application.countDocuments();
  const totalStudents = await StudentProfile.countDocuments();

  const activeDrives = await JobDrive.countDocuments({ status: "active" });
  const selectedCandidates = await Application.countDocuments({
    status: "selected",
  });
  const offersReleased = await Application.countDocuments({ status: "offer" });

  return {
    totalCompanies,
    totalDrives,
    totalApplications,
    totalStudents,
    activeDrives,
    selectedCandidates,
    offersReleased,
  };
};

module.exports = {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getAllDrives,
  createDrive,
  updateDrive,
  deleteDrive,
  getDriveApplicants,
  shortlistApplicants,
  rejectApplicant,
  scheduleInterviews,
  getAllInterviews,
  releaseOffers,
  getAllApplications,
  getAnalytics,
};
