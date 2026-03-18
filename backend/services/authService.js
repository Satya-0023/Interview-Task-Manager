const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Business logic for Authentication operations
class AuthService {
  // Look up user by email
  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  // Create new user in DB
  async registerUser(userData) {
    const user = await User.create(userData);
    return this._formatUserResponse(user);
  }

  // Format the user data for the frontend response
  _formatUserResponse(user) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    };
  }

  // Check if password is correct
  async validatePassword(user, password) {
    return await user.matchPassword(password);
  }

  // Get formatted user data for login
  getAuthResponse(user) {
    return this._formatUserResponse(user);
  }
}

module.exports = new AuthService();
