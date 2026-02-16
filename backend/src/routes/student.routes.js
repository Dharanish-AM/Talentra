const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const { authenticate, authorize } = require("../middleware/auth");
const { validateProfile } = require("../validators/student.validator");
const upload = require("../middleware/upload");

router.use(authenticate);
router.use(authorize("student"));

router.get("/profile", studentController.getProfile);
router.put("/profile", validateProfile, studentController.updateProfile);
router.post(
  "/profile/resume",
  upload.single("resume"),
  studentController.uploadResume,
);

router.get("/drives", studentController.getEligibleDrives);
router.post("/drives/:id/apply", studentController.applyToDrive);

router.get("/applications", studentController.getMyApplications);
router.get("/interviews", studentController.getMyInterviews);

module.exports = router;
