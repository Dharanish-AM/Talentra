const StudentProfile = require("../models/StudentProfile");

const checkEligibility = (studentProfile, eligibilityCriteria) => {
  const { cgpa, department, backlogs } = studentProfile;
  const { minCgpa, allowedDepartments, maxBacklogs } = eligibilityCriteria;

  if (cgpa < minCgpa) {
    return {
      eligible: false,
      reason: `CGPA ${cgpa} is below minimum requirement of ${minCgpa}`,
    };
  }

  if (!allowedDepartments.includes(department)) {
    return {
      eligible: false,
      reason: `Department ${department} is not eligible`,
    };
  }

  if (backlogs > maxBacklogs) {
    return {
      eligible: false,
      reason: `${backlogs} backlogs exceed maximum allowed ${maxBacklogs}`,
    };
  }

  return { eligible: true };
};

const filterEligibleDrives = async (userId, drives) => {
  const profile = await StudentProfile.findOne({ userId });

  if (!profile) {
    return [];
  }

  return drives.filter((drive) => {
    const result = checkEligibility(profile, drive.eligibility);
    return result.eligible;
  });
};

module.exports = {
  checkEligibility,
  filterEligibleDrives,
};
