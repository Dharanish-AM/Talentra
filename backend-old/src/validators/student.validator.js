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

const profileSchema = Joi.object({
  department: Joi.string()
    .valid(...DEPARTMENTS)
    .required(),
  cgpa: Joi.number().min(0).max(10).required(),
  backlogs: Joi.number().integer().min(0).required(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
  graduationYear: Joi.number().integer().min(2020).max(2030).required(),
  skills: Joi.array().items(Joi.string()).min(1).required(),
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
  validateProfile: validate(profileSchema),
};
