const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Only Admin can manage users
router.use(restrictTo('Admin'));

router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .patch(userController.updateUserRole)
  .delete(userController.deleteUser);

module.exports = router;
