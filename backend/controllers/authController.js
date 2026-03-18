const asyncHandler = require('express-async-handler');
const authService = require('../services/authService');

// Handle user registration
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields: name, email, and password');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  const userExists = await authService.findUserByEmail(email);

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const userData = await authService.registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    data: userData,
  });
});

// Handle user login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password');
  }

  const user = await authService.findUserByEmail(email);

  if (user && (await authService.validatePassword(user, password))) {
    res.json({
      success: true,
      data: authService.getAuthResponse(user),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

module.exports = {
  registerUser,
  loginUser,
};
