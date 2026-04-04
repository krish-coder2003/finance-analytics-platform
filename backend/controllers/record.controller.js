const recordService = require('../services/record.service');
const catchAsync = require('../utils/catchAsync');

exports.createRecord = catchAsync(async (req, res, next) => {
  const record = await recordService.createRecord(req.body, req.user._id);
  res.status(201).json({
    status: 'success',
    data: { record }
  });
});

exports.getAllRecords = catchAsync(async (req, res, next) => {
  const result = await recordService.getAllRecords(req.query, req.user._id, req.user.role);
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getRecord = catchAsync(async (req, res, next) => {
  const record = await recordService.getRecord(req.params.id, req.user._id, req.user.role);
  res.status(200).json({
    status: 'success',
    data: { record }
  });
});

exports.updateRecord = catchAsync(async (req, res, next) => {
  const record = await recordService.updateRecord(req.params.id, req.body, req.user._id, req.user.role);
  res.status(200).json({
    status: 'success',
    data: { record }
  });
});

exports.deleteRecord = catchAsync(async (req, res, next) => {
  await recordService.deleteRecord(req.params.id, req.user._id, req.user.role);
  res.status(204).json({
    status: 'success',
    data: null
  });
});
