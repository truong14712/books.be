import CouponSchema from '~/schemas/couponSchema';
import validateRequest from '~/middlewares/validateRequest.js';

const { coupon } = CouponSchema;

const CouponValidation = {
  coupon: validateRequest(coupon),
};
export default CouponValidation;
