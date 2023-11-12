import Joi from 'joi';

const OrderSchema = {
  order: Joi.object({
    orderId: Joi.string(),
    userId: Joi.string().required(),
    cart: Joi.array().required(),
    status: Joi.string().default('Đang xử lý'),
    reason: Joi.string(),
    shippingFee: Joi.number().default(0),
    shippingAddress: Joi.object(),
    totalPrice: Joi.number().required(),
    paymentInfo: Joi.object({
      status: Joi.string(),
      type: Joi.string(),
    }),
    deliveredAt: Joi.date(),
    paidAt: Joi.date().default(Date.now()),
  }),
};
export default OrderSchema;
