import couponService from '~/services/couponService';
import ErrorHandler from '~/utils/ErrorHandler';

const couponController = {
  async create(req, res, next) {
    try {
      const data = {
        ...req.body,
        createdBy: req.user.id,
      };
      const coupon = await couponService.create(data);
      return res.apiResponse(coupon);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const coupon = await couponService.update(id, data);
      return res.apiResponse(coupon);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAll(req, res, next) {
    try {
      const query = req.query;
      const coupons = await couponService.getAll(query);
      return res.apiResponse(coupons);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getByAdmin(req, res, next) {
    try {
      const { id } = req.user;
      const coupon = await couponService.getByAdmin(id);
      return res.apiResponse(coupon);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const coupon = await couponService.delete(id);
      return res.apiResponse(coupon);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const coupon = await couponService.getById(id);
      return res.apiResponse(coupon);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async applyCoupon(req, res, next) {
    try {
      const data = req.body;
      const coupon = await couponService.applyCoupon(data);
      return res.apiResponse(coupon);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default couponController;
