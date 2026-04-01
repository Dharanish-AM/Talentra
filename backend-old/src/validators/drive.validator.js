const Joi = require("joi");

const DEPARTMENTS = [
  "Computer Science",
  "IT",
  "Electronics",
  "Electrical",
  "Mechanical",
  "Civil",
  "AI/ML",
  "Chemical",
];

const driveSchema = Joi.object({
  companyId: Joi.string().required(),
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).required(),
  role: Joi.string().required(),
  package: Joi.string().required(),
  location: Joi.string().required(),
  eligibility: Joi.object({
    minCgpa: Joi.number().min(0).max(10).required(),
    allowedDepartments: Joi.array()
      .items(Joi.string().valid(...DEPARTMENTS))
      .min(1)
      .required(),
    maxBacklogs: Joi.number().integer().min(0).required(),
  }).required(),
  deadline: Joi.date().iso().required(),
  driveDate: Joi.date().iso().required(),
  status: Joi.string()
    .valid("upcoming", "active", "completed")
    .default("upcoming"),
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
};

module.exports = {
  validateDrive: validate(driveSchema),
};
