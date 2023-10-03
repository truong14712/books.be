import express from 'express';
import couponController from '~/controllers/couponController';
import CategoryValidation from '~/validations/categoryValidation';
import CheckMiddleware from '~/middlewares/checkPermission';
const router = express.Router();

router.get('/', couponController.getAll);
router.get('/getByAdmin', CheckMiddleware.authentication, CheckMiddleware.authorization, couponController.getByAdmin);
router.get('/:id', couponController.getById);
router.post('/', CheckMiddleware.authentication, CheckMiddleware.authorization, couponController.create);
router.post('/applyCoupon', CheckMiddleware.authentication, couponController.applyCoupon);
router.patch('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, couponController.update);
router.delete('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, couponController.delete);
export default router;
