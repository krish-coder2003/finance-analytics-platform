const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const stats = await dashboardService.getDashboardStats(req.user._id, req.user.role);
  res.status(200).json({
    status: 'success',
    data: stats
  });
});
