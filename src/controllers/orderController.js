import orderService from '~/services/order.service';
import ErrorHandler from '~/utils/ErrorHandler';

const orderController = {
  async create(req, res, next) {
    try {
      const data = req.body;
      const coupon = await orderService.create(data);
      return res.apiResponse(coupon);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async updateOrderStatus(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const userId = req.user.id;
      const order = await orderService.updateOrderStatus(id, data, userId);
      return res.apiResponse(order);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default orderController;
