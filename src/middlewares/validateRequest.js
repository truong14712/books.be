import ValidationError from '~/utils/ErrorHandler';
import asyncHandler from 'express-async-handler';

const validateRequest = (schema) =>
  asyncHandler(async (req, res, next) => {
    const { error } = await schema.validate(req.body, { abortEarly: false });
    if (error)
      throw new ValidationError(
        error.details.map((err) => err.message),
        422,
      );
    next();
  });
export default validateRequest;
