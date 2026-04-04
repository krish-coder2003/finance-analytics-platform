const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

exports.updateUserRole = catchAsync(async (req, res, next) => {
  const user = await userService.updateUserRole(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await userService.deleteUser(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});
