const Joi = require('joi');

const createRecordSchema = Joi.object({
  amount: Joi.number().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().required(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().allow('').optional()
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().optional(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().allow('').optional()
}).min(1);

module.exports = {
  createRecordSchema,
  updateRecordSchema
};
