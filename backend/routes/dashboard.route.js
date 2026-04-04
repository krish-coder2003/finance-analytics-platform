const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
// Analyst and Admin have access to advanced analytics? 
// The assignment says: "Dashboard APIs... Access Control: Viewer -> read only, Analyst -> read+analytics, Admin -> full access".
// So Viewer can see dashboard but only their own stats maybe? Our dashboard service checks `role === 'Viewer'` and isolates to their data only.

router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
