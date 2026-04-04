const Record = require('../models/record.model');

exports.getDashboardStats = async (userId, role) => {
  let matchStage = {};
  
  // Dashboard is global organizational data. All roles see the exact same corporate analytics.

  // Total Income, Expense, Balance
  const totalStats = await Record.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    }
  ]);

  let income = 0;
  let expense = 0;
  
  totalStats.forEach(stat => {
    if (stat._id === 'income') income = stat.total;
    if (stat._id === 'expense') expense = stat.total;
  });

  const netBalance = income - expense;

  // Category-wise Aggregation
  const categoryStats = await Record.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { type: '$type', category: '$category' },
        total: { $sum: '$amount' }
      }
    },
    {
      $group: {
        _id: '$_id.type',
        categories: {
          $push: {
            category: '$_id.category',
            total: '$total'
          }
        }
      }
    }
  ]);

  // Monthly Trends (Current Year)
  const currentYear = new Date().getFullYear();
  const monthlyTrendsRaw = await Record.aggregate([
    { 
      $match: {
        ...matchStage,
        date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    }
  ]);

  // Recent Transactions
  const recentTransactions = await Record.find(matchStage)
    .sort('-date')
    .limit(5)
    .populate('user', 'name');

  return {
    summary: {
      income,
      expense,
      netBalance
    },
    categoryStats,
    monthlyTrendsRaw,
    recentTransactions
  };
};
