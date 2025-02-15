const Joi = require('joi');
const { HttpCode } = require('./constants');

const schemaValidateContact = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/\(\d{3}\)\s\d{3}-\d{4}/),
  favorite: Joi.boolean(),
  subscription: Joi.any().valid('free', 'starter', 'pro', 'premium'),
});

const schemaValidateAuth = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});

const schemaValidateUpdateSub = Joi.object({
  subscription: Joi.any().valid('free', 'starter', 'pro', 'premium').required(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Failed: ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.validateContact = (req, _res, next) => {
  return validate(schemaValidateContact, req.body, next);
};

module.exports.validateAuth = (req, _res, next) => {
  return validate(schemaValidateAuth, req.body, next);
};

module.exports.validateUpdateSub = (req, _res, next) => {
  return validate(schemaValidateUpdateSub, req.body, next);
};

module.exports.validateUploadAvatar = (req, _res, next) => {
  if (!req.file) {
    return next({
      status: HttpCode.BAD_REQUEST,
      message: 'Bad request',
    });
  }
  next();
};
