const Joi = require('joi');
const AppError = require('../utils/appError');

const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  Object.assign(req, value);
  return next();
};

module.exports = validate;
