import express from 'express';
import cartController from '~/controllers/cartController';
import CheckMiddleware from '~/middlewares/checkPermission';
const router = express.Router();

router.get('/', cartController.getAll);
router.get('/:id', CheckMiddleware.authentication, cartController.getById);
router.post('/', CheckMiddleware.authentication, cartController.create);
router.post('/update', CheckMiddleware.authentication, cartController.update);
router.post('/updateCartItemQuantity', CheckMiddleware.authentication, cartController.updateCartItemQuantity);
router.patch('/updateInCart', cartController.updateInCart);
router.delete('/:id', CheckMiddleware.authentication, cartController.delete);
export default router;
