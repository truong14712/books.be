import express from 'express';
import orderController from '~/controllers/orderController';
import OrderValidation from '~/validations/orderValidation';
import CheckMiddleware from '~/middlewares/checkPermission';
const router = express.Router();

router.get('/', orderController.getAll);
router.get('/searchOrderUser', CheckMiddleware.authentication, orderController.searchOrderUser);
router.get('/getAllOrderUser/:id', CheckMiddleware.authentication, orderController.getAllOrderUser);
router.get('/restoreOrder/:id', orderController.restoreOrder);
router.get('/:id', orderController.getById);
router.post('/', CheckMiddleware.authentication, OrderValidation.order, orderController.create);
router.patch('/cancelOrder/:id', CheckMiddleware.authentication, orderController.cancelOrder);
router.patch('/refundOrder/:id', CheckMiddleware.authentication, orderController.refundOrder);
router.patch(
  '/refundOrderSuccess/:id',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  orderController.refundOrderSuccess,
);
router.patch('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, orderController.updateOrderStatus);

export default router;
