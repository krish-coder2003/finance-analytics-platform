const Record = require('../models/record.model');
const AppError = require('../utils/appError');

exports.createRecord = async (recordData, userId) => {
  return await Record.create({ ...recordData, user: userId });
};

exports.getAllRecords = async (query, userId, role) => {
  let filter = {};

  // Database is global organizational data. 

  // Search by Text
  if (query.search) {
    filter.$or = [
      { category: { $regex: query.search, $options: 'i' } },
      { notes: { $regex: query.search, $options: 'i' } }
    ];
  }

  // Filtering
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  // Pagination
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const records = await Record.find(filter)
    .sort('-date')
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');

  const total = await Record.countDocuments(filter);

  return {
    records,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

exports.getRecord = async (id, userId, role) => {
  const record = await Record.findById(id);
  if (!record) throw new AppError('No record found with that ID', 404);

  if (role === 'Viewer' && record.user.toString() !== userId.toString()) {
    throw new AppError('You do not have permission to view this record', 403);
  }

  return record;
};

exports.updateRecord = async (id, updateData, userId, role) => {
  const record = await Record.findById(id);
  if (!record) throw new AppError('No record found with that ID', 404);

  if (role !== 'Admin' && record.user.toString() !== userId.toString()) {
    throw new AppError('You do not have permission to edit this record', 403);
  }

  Object.assign(record, updateData);
  await record.save();
  return record;
};

exports.deleteRecord = async (id, userId, role) => {
  const record = await Record.findById(id);

  if (!record) {
    throw new AppError('No record found with that ID', 404);
  }

  // Only Admin can delete any, Analyst can only delete their own
  // Actually, earlier requirements allowed Admin absolute power
  if (role !== 'Admin' && record.user.toString() !== userId) {
    throw new AppError('You do not have permission to delete this record', 403);
  }

  // Soft Delete Operation
  await Record.findByIdAndUpdate(id, { isDeleted: true });
};
