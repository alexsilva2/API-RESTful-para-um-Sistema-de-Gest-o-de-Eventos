const Joi = require('joi');

const eventSchema = Joi.object({
  title: Joi.string().trim().required(),
  date: Joi.date().iso().required(),
  capacity: Joi.number().integer().positive().max(Number.MAX_SAFE_INTEGER).required(),
});

const registrationSchema = Joi.object({
  participantName: Joi.string().trim().required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
});

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.required().validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: 'Dados inválidos.',
        details: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    req.body = value;
    next();
  };
}

module.exports = {
  validateEvent: validateBody(eventSchema),
  validateRegistration: validateBody(registrationSchema),
};
