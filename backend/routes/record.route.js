const express = require('express');
const recordController = require('../controllers/record.controller');
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createRecordSchema, updateRecordSchema } = require('../validations/record.validation');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(restrictTo('Admin', 'Analyst'), recordController.getAllRecords)
  .post(
    restrictTo('Admin'), 
    validate(createRecordSchema), 
    recordController.createRecord
  );

router.route('/:id')
  .get(restrictTo('Admin', 'Analyst'), recordController.getRecord)
  .patch(
    restrictTo('Admin'), 
    validate(updateRecordSchema), 
    recordController.updateRecord
  )
  .delete(restrictTo('Admin'), recordController.deleteRecord);

module.exports = router;
