const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiter.controller");
const { authenticate, authorize } = require("../middleware/auth");
const { validateDrive } = require("../validators/drive.validator");

router.use(authenticate);
router.use(authorize("recruiter"));

router.get("/candidates", recruiterController.getCandidates);
router.get(
  "/applications/shortlisted",
  recruiterController.getShortlistedApplications,
);
router.post("/feedback/:id", recruiterController.submitFeedback);
router.put("/candidates/:id/result", recruiterController.updateCandidateResult);
router.post("/drives", validateDrive, recruiterController.createDrive);

module.exports = router;
