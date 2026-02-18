const adminService = require("../services/admin.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { convertToCSV } = require("../utils/csvExporter");

const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await adminService.getAllCompanies();

  res
    .status(200)
    .json(
      new ApiResponse(200, { companies }, "Companies retrieved successfully"),
    );
});

const createCompany = asyncHandler(async (req, res) => {
  const company = await adminService.createCompany(req.body, req.user.id);

  res
    .status(201)
    .json(new ApiResponse(201, { company }, "Company created successfully"));
});

const updateCompany = asyncHandler(async (req, res) => {
  const company = await adminService.updateCompany(req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, { company }, "Company updated successfully"));
});

const deleteCompany = asyncHandler(async (req, res) => {
  await adminService.deleteCompany(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Company deleted successfully"));
});

const getAllDrives = asyncHandler(async (req, res) => {
  const drives = await adminService.getAllDrives();

  res
    .status(200)
    .json(new ApiResponse(200, { drives }, "Drives retrieved successfully"));
});

const createDrive = asyncHandler(async (req, res) => {
  const drive = await adminService.createDrive(req.body, req.user.id);

  res
    .status(201)
    .json(new ApiResponse(201, { drive }, "Drive created successfully"));
});

const updateDrive = asyncHandler(async (req, res) => {
  const drive = await adminService.updateDrive(req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, { drive }, "Drive updated successfully"));
});

const deleteDrive = asyncHandler(async (req, res) => {
  await adminService.deleteDrive(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Drive deleted successfully"));
});

const getDriveApplicants = asyncHandler(async (req, res) => {
  const applicants = await adminService.getDriveApplicants(req.params.id);

  res
    .status(200)
    .json(
      new ApiResponse(200, { applicants }, "Applicants retrieved successfully"),
    );
});

const shortlistApplicants = asyncHandler(async (req, res) => {
  const { applicationIds } = req.body;
  const result = await adminService.shortlistApplicants(applicationIds);

  res
    .status(200)
    .json(
      new ApiResponse(200, { result }, "Applicants shortlisted successfully"),
    );
});

const rejectApplicant = asyncHandler(async (req, res) => {
  const { applicationId } = req.body;
  const result = await adminService.rejectApplicant(applicationId);

  res
    .status(200)
    .json(new ApiResponse(200, { result }, "Applicant rejected successfully"));
});

const scheduleInterviews = asyncHandler(async (req, res) => {
  const interviews = await adminService.scheduleInterviews(req.body.interviews);

  res
    .status(201)
    .json(
      new ApiResponse(201, { interviews }, "Interviews scheduled successfully"),
    );
});

const getAllInterviews = asyncHandler(async (req, res) => {
  const interviews = await adminService.getAllInterviews();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { interviews },
        "All interviews retrieved successfully",
      ),
    );
});

const releaseOffers = asyncHandler(async (req, res) => {
  const { applicationIds } = req.body;
  const result = await adminService.releaseOffers(applicationIds);

  res
    .status(200)
    .json(new ApiResponse(200, { result }, "Offers released successfully"));
});

const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await adminService.getAllApplications();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { applications },
        "All applications retrieved successfully",
      ),
    );
});

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAnalytics();

  res
    .status(200)
    .json(
      new ApiResponse(200, { analytics }, "Analytics retrieved successfully"),
    );
});

const exportAnalytics = asyncHandler(async (req, res) => {
  const data = await adminService.getExportData();
  const csv = convertToCSV(data);

  res.header("Content-Type", "text/csv");
  res.attachment("placement_report.csv");
  res.send(csv);
});

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
  exportAnalytics,
};
