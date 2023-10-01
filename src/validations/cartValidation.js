import CartSchema from '~/schemas/cartSchema.js';
import validateRequest from '~/middlewares/validateRequest.js';

const { cart } = CartSchema;

const CategoryValidation = {
  cart: validateRequest(cart),
};
export default CategoryValidation;
