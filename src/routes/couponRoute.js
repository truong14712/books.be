import express from 'express';
import couponController from '~/controllers/couponController';
import CouponValidation from '~/validations/couponValidation';
import CheckMiddleware from '~/middlewares/checkPermission';
const router = express.Router();

router.get('/', couponController.getAll);
router.get('/:id', couponController.getById);
router.post(
  '/',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  CouponValidation.coupon,
  couponController.create,
);
router.post('/applyCoupon', CheckMiddleware.authentication, couponController.applyCoupon);
router.patch(
  '/:id',
  CouponValidation.coupon,
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  couponController.update,
);
router.delete('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, couponController.delete);
export default router;
