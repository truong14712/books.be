import express from 'express';
import paypalController from '~/controllers/paypalController';
import CheckMiddleware from '~/middlewares/checkPermission';

const router = express.Router();

router.post('/create_order', CheckMiddleware.authentication, paypalController.createOrder);
router.post('/success_order', CheckMiddleware.authentication, paypalController.successOrder);

export default router;
