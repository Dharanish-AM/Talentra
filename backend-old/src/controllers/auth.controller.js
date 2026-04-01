const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, result, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "User retrieved successfully"));
});

module.exports = {
  register,
  login,
  getMe,
};
