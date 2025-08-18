const User = require('../models/User');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Create password reset token
const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  const passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return { resetToken, passwordResetToken, passwordResetExpires };
};

class AuthService {
  // Register new user
  static async register(userData) {
    const { name, email, password, country, state, phoneNumber } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      country,
      state,
      phoneNumber
    });

    // Generate token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    return {
      user,
      token
    };
  }

  // Login user
  static async login(email, password) {
    // Check if email and password exist
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    return {
      user,
      token
    };
  }

  // Forgot password
  static async forgotPassword(email) {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('There is no user with this email address', 404);
    }

    // Generate reset token
    const { resetToken, passwordResetToken, passwordResetExpires } = createPasswordResetToken();

    // Save hashed token to database
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save({ validateBeforeSave: false });

    // In a real application, you would send an email here
    // For now, we'll return the reset token (in production, this should be sent via email)
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Simulate email sending (replace with actual email service)
    console.log('Password reset email would be sent to:', email);
    console.log('Reset URL:', resetURL);

    return {
      message: 'Password reset token sent to email',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      resetURL: process.env.NODE_ENV === 'development' ? resetURL : undefined
    };
  }

  // Reset password
  static async resetPassword(resetToken, newPassword) {
    // Hash the reset token to compare with stored token
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find user by reset token and check if token is expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Token is invalid or has expired', 400);
    }

    // Set new password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now() - 1000; // Ensure token is created after password change
    await user.save();

    // Generate new JWT token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    return {
      message: 'Password reset successful',
      user,
      token
    };
  }

  // Get user profile
  static async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    // Remove fields that shouldn't be updated
    const filteredData = { ...updateData };
    delete filteredData.password;
    delete filteredData.role;
    delete filteredData.email;

    const user = await User.findByIdAndUpdate(
      userId,
      filteredData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Change password
  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check current password
    if (!(await user.correctPassword(currentPassword, user.password))) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return {
      message: 'Password changed successfully'
    };
  }

  // Logout user
  static async logout(userId) {
    // In a more complex system, you might want to blacklist the token
    // For now, we'll just return a success message
    return {
      message: 'Logged out successfully'
    };
  }
}

module.exports = AuthService;
