import OrderSchema from '~/schemas/orderSchema';
import validateRequest from '~/middlewares/validateRequest.js';

const { order } = OrderSchema;

const OrderValidation = {
  order: validateRequest(order),
};
export default OrderValidation;
