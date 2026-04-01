const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const studentRoutes = require("./student.routes");
const adminRoutes = require("./admin.routes");
const recruiterRoutes = require("./recruiter.routes");

router.use("/auth", authRoutes);
router.use("/student", studentRoutes);
router.use("/admin", adminRoutes);
router.use("/recruiter", recruiterRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
