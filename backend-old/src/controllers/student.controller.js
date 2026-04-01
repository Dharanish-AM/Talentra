const studentService = require("../services/student.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.getProfile(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Profile retrieved successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.updateProfile(req.user.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Profile updated successfully"));
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please upload a file"));
  }

  const profile = await studentService.uploadResume(req.user.id, req.file.path);

  res
    .status(200)
    .json(new ApiResponse(200, { profile }, "Resume uploaded successfully"));
});

const getEligibleDrives = asyncHandler(async (req, res) => {
  const drives = await studentService.getEligibleDrives(req.user.id);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { drives },
        "Eligible drives retrieved successfully",
      ),
    );
});

const applyToDrive = asyncHandler(async (req, res) => {
  const application = await studentService.applyToDrive(
    req.user.id,
    req.params.id,
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { application },
        "Application submitted successfully",
      ),
    );
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await studentService.getMyApplications(req.user.id);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { applications },
        "Applications retrieved successfully",
      ),
    );
});

const getMyInterviews = asyncHandler(async (req, res) => {
  const interviews = await studentService.getMyInterviews(req.user.id);

  res
    .status(200)
    .json(
      new ApiResponse(200, { interviews }, "Interviews retrieved successfully"),
    );
});

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  getEligibleDrives,
  applyToDrive,
  getMyApplications,
  getMyInterviews,
};
