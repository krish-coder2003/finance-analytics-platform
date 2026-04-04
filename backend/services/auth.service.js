const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user) => {
  const token = signToken(user._id);
  user.password = undefined; // Remove password from output
  return { token, user };
};

exports.register = async (userData) => {
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: 'Viewer' // default role
  });

  return createSendToken(newUser);
};

exports.login = async (email, password) => {
  console.log('Login Payload => email:', email, ' password:', password);
  
  if (!email || !password) {
    throw new AppError('Please provide email and password!', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  console.log('User found in DB:', user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact an Admin.', 403);
  }

  return createSendToken(user);
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};
