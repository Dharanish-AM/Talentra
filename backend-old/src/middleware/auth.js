const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized to access this route");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      throw new ApiError(401, "User not found");
    }

    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized to access this route");
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role ${req.user.role} is not authorized to access this route`,
      );
    }

    next();
  };
};

module.exports = { authenticate, authorize };
