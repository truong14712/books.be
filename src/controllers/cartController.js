import cartService from '~/services/cart.service';
import ErrorHandler from '~/utils/ErrorHandler';

const cartController = {
  async create(req, res, next) {
    try {
      const data = req.body;
      const cart = await cartService.create(data);
      return res.apiResponse(cart);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async update(req, res, next) {
    try {
      const data = req.body;
      const cart = await cartService.update(data);
      return res.apiResponse(cart);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async updateInCart(req, res, next) {
    try {
      const data = req.body;
      const cart = await cartService.updateInCart(data);
      return res.apiResponse(cart);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const cart = await cartService.delete(id);
      return res.apiResponse(cart);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async clearCarts(req, res, next) {
    try {
      const cart = await cartService.clearCarts(req.body);
      return res.apiResponse(cart);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAll(req, res, next) {
    try {
      const carts = await cartService.getAll();
      return res.apiResponse(carts);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const cart = await cartService.getById(id);
      return res.apiResponse(cart);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async updateCartItemQuantity(req, res, next) {
    try {
      const data = req.body;
      const cart = await cartService.updateCartItemQuantity(data);
      return res.apiResponse(cart);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default cartController;
