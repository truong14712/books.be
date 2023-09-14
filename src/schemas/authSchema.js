import Joi from 'joi';

const AuthSchema = {
  register: Joi.object({
    firstName: Joi.string().pattern(/^\D+$/).required().messages({
      'string.pattern.base': 'The name cannot enter numbers and special characters',
    }),
    lastName: Joi.string().pattern(/^\D+$/).required().messages({
      'string.pattern.base': 'The name cannot enter numbers and special characters',
    }),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(8).required(),
    phoneNumber: Joi.number(),
    avatar: Joi.string(),
    addresses: Joi.array().items(Joi.object()),
  }),
  login: Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().min(8).required(),
  }),
};

export default AuthSchema;
