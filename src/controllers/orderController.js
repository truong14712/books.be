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
  async cancelOrder(req, res, next) {
    try {
      const data = req.body;
      const id = req.params.id;
      const order = await orderService.cancelOrder(data, id);
      return res.apiResponse(order);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAll(req, res, next) {
    try {
      const query = req.query;
      const order = await orderService.getAll(query);
      return res.apiResponse(order);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderService.getById(id);
      return res.apiResponse(order);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async searchOrderUser(req, res, next) {
    try {
      const userId = req.user.id;
      const query = req.query;
      const order = await orderService.searchOrderUser(userId, query);
      return res.apiResponse(order);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAllOrderUser(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderService.getAllOrderUser(id);
      return res.apiResponse(order);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async restoreOrder(req, res, next) {
    try {
      const id = req.params.id;
      const order = await orderService.restoreOrder(id);
      return res.apiResponse(order);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default orderController;
