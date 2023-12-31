import express from 'express';
import cartController from '~/controllers/cartController';
import CheckMiddleware from '~/middlewares/checkPermission';
import CartValidation from '~/validations/cartValidation';

const router = express.Router();

router.get('/', cartController.getAll);
router.get('/:id', CheckMiddleware.authentication, cartController.getById);
router.post('/', CheckMiddleware.authentication, CartValidation.cart, cartController.create);
router.post('/update', CheckMiddleware.authentication, CartValidation.cart, cartController.update);
router.post('/updateCartItemQuantity', CheckMiddleware.authentication, cartController.updateCartItemQuantity);
router.patch('/updateInCart', cartController.updateInCart);
router.post('/clearCarts', CheckMiddleware.authentication, cartController.clearCarts);
router.delete('/:id', CheckMiddleware.authentication, cartController.delete);
export default router;
