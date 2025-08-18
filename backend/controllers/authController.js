const AuthService = require('../services/authService');
const { catchAsync } = require('../middleware/errorMiddleware');
const { validationResult } = require('express-validator');

class AuthController {
  // Register user
  static register = catchAsync(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, country, state, phoneNumber } = req.body;

    const result = await AuthService.register({
      name,
      email,
      password,
      country,
      state,
      phoneNumber
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result
    });
  });

  // Login user
  static login = catchAsync(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result
    });
  });

  // Forgot password
  static forgotPassword = catchAsync(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const result = await AuthService.forgotPassword(email);

    res.status(200).json({
      status: 'success',
      message: result.message,
      data: {
        resetToken: result.resetToken,
        resetURL: result.resetURL
      }
    });
  });

  // Reset password
  static resetPassword = catchAsync(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { resetToken, newPassword } = req.body;

    const result = await AuthService.resetPassword(resetToken, newPassword);

    res.status(200).json({
      status: 'success',
      message: result.message,
      data: {
        user: result.user,
        token: result.token
      }
    });
  });

  // Get current user profile
  static getProfile = catchAsync(async (req, res, next) => {
    const user = await AuthService.getProfile(req.user.id);

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  });

  // Update user profile
  static updateProfile = catchAsync(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await AuthService.updateProfile(req.user.id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  });

  // Change password
  static changePassword = catchAsync(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const result = await AuthService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      status: 'success',
      message: result.message
    });
  });

  // Logout
  static logout = catchAsync(async (req, res, next) => {
    const result = await AuthService.logout(req.user.id);

    res.status(200).json({
      status: 'success',
      message: result.message
    });
  });

  // Check authentication status
  static checkAuth = catchAsync(async (req, res, next) => {
    res.status(200).json({
      status: 'success',
      message: 'User is authenticated',
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          country: req.user.country,
          state: req.user.state
        }
      }
    });
  });
}

module.exports = AuthController;
