import express from 'express';
import statisticalController from '~/controllers/statisticalController';
import CheckMiddleware from '~/middlewares/checkPermission';
const router = express.Router();

router.get(
  '/calculateTotalRevenue',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  statisticalController.calculateTotalRevenue,
);
router.get(
  '/calculateRevenueByAuthor',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  statisticalController.calculateRevenueByAuthor,
);
router.get(
  '/totalOrder',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  statisticalController.totalOrder,
);
router.get(
  '/countRatingInOrders',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  statisticalController.countRatingInOrders,
);
export default router;
