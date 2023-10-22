import Joi from 'joi';

const CouponSchema = {
  coupon: Joi.object({
    code: Joi.string().required(),
    discount: Joi.number().required(),
    description: Joi.string().required(),
    minAmount: Joi.number().required(),
    expirationDate: Joi.date().required(),
    createdBy: Joi.string(),
    quantity: Joi.number().required(),
  }),
};
export default CouponSchema;
