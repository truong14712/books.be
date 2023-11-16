import Joi from 'joi';

const ReportSchema = {
  report: Joi.object({
    userId: Joi.string().required(),
    bookId: Joi.string().required(),
    reason: Joi.string().required(),
    comment: Joi.string().required(),
  }),
};
export default ReportSchema;
