const User = require('../models/user.model');
const AppError = require('../utils/appError');

exports.getAllUsers = async () => {
  return await User.find().select('-password');
};

exports.updateUserRole = async (userId, updateData) => {
  const allowedUpdates = {};
  if (updateData.role) allowedUpdates.role = updateData.role;
  if (updateData.isActive !== undefined) allowedUpdates.isActive = updateData.isActive;

  const user = await User.findByIdAndUpdate(userId, allowedUpdates, {
    new: true,
    runValidators: true
  });

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }
  
  return user;
};

exports.deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }
};
