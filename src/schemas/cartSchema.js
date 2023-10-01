import Joi from 'joi';

const CartSchema = {
  cart: Joi.object({
    userId: Joi.string().required(),
    books: Joi.array().default([]),
  }),
};
export default CartSchema;
