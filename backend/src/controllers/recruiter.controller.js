const recruiterService = require("../services/recruiter.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getCandidates = asyncHandler(async (req, res) => {
  const candidates = await recruiterService.getCandidates();

  res
    .status(200)
    .json(
      new ApiResponse(200, { candidates }, "Candidates retrieved successfully"),
    );
});

const getShortlistedApplications = asyncHandler(async (req, res) => {
  const applications = await recruiterService.getShortlistedApplications();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { applications },
        "Shortlisted applications retrieved successfully",
      ),
    );
});

const submitFeedback = asyncHandler(async (req, res) => {
  const interview = await recruiterService.submitFeedback(
    req.params.id,
    req.body,
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, { interview }, "Feedback submitted successfully"),
    );
});

const updateCandidateResult = asyncHandler(async (req, res) => {
  const { result } = req.body;
  const interview = await recruiterService.updateCandidateResult(
    req.params.id,
    result,
  );

  res
    .status(200)
    .json(new ApiResponse(200, { interview }, "Result updated successfully"));
});

const createDrive = asyncHandler(async (req, res) => {
  const drive = await recruiterService.createDrive(req.body, req.user.id);

  res
    .status(201)
    .json(new ApiResponse(201, { drive }, "Drive created successfully"));
});

module.exports = {
  getCandidates,
  getShortlistedApplications,
  submitFeedback,
  updateCandidateResult,
  createDrive,
};
