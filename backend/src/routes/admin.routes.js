const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth");
const { validateDrive } = require("../validators/drive.validator");

router.use(authenticate);
router.use(authorize("admin"));

router.get("/companies", adminController.getAllCompanies);
router.post("/companies", adminController.createCompany);
router.put("/companies/:id", adminController.updateCompany);
router.delete("/companies/:id", adminController.deleteCompany);

router.get("/drives", adminController.getAllDrives);
router.post("/drives", validateDrive, adminController.createDrive);
router.put("/drives/:id", adminController.updateDrive);
router.delete("/drives/:id", adminController.deleteDrive);

router.get("/drives/:id/applicants", adminController.getDriveApplicants);
router.post("/applicants/shortlist", adminController.shortlistApplicants);
router.post("/applicants/reject", adminController.rejectApplicant);

router.post("/interviews/schedule", adminController.scheduleInterviews);
router.get("/interviews", adminController.getAllInterviews);
router.post("/offers/release", adminController.releaseOffers);
router.get("/applications", adminController.getAllApplications);

router.get("/analytics", adminController.getAnalytics);

module.exports = router;
