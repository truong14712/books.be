import Joi from 'joi';

const AuthSchema = {
  register: Joi.object({
    firstName: Joi.string().pattern(/^\D+$/).required().messages({
      'string.pattern.base': 'The name cannot enter numbers and special characters',
    }),
    lastName: Joi.string().pattern(/^\D+$/).required().messages({
      'string.pattern.base': 'The name cannot enter numbers and special characters',
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .max(30),
    password: Joi.string().min(6).required().max(20),
    phoneNumber: Joi.number().required(),
    avatar: Joi.object({
      url: Joi.string().required(),
      public_id: Joi.string().required(),
    }),
    addresses: Joi.array().items(Joi.object()),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
      'any.only': 'Confirm Password wrong!',
    }),
  }),
  login: Joi.object({
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(6).required().max(20),
  }),
  changeInformation: Joi.object({
    firstName: Joi.string().pattern(/^\D+$/).required().messages({
      'string.pattern.base': 'The name cannot enter numbers and special characters',
    }),
    lastName: Joi.string().pattern(/^\D+$/).required().messages({
      'string.pattern.base': 'The name cannot enter numbers and special characters',
    }),
    phoneNumber: Joi.number().required(),
  }),
  changePassword: Joi.object({
    password: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
      'any.only': 'Confirm Password wrong!',
    }),
  }),
  addAddress: Joi.object({
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().required(),
    zipCode: Joi.number().required(),
    addressType: Joi.string().required(),
    status: Joi.boolean().default(false),
  }),
  forgotPassword: Joi.object({
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  }),
  resetPassword: Joi.object({
    newPassword: Joi.string().min(6).required(),
  }),
};

export default AuthSchema;
