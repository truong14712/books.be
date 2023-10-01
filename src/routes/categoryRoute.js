import express from 'express';
import categoryController from '~/controllers/categoryController';
import CategoryValidation from '~/validations/categoryValidation';
import CheckMiddleware from '~/middlewares/checkPermission';
const router = express.Router();

router.get('/', categoryController.getAll);
router.get('/getBooksByCategory/:id', categoryController.getBooksByCategory);
router.get('/:id', categoryController.getById);
router.post(
  '/',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  CategoryValidation.category,
  categoryController.create,
);
router.put(
  '/:id',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  CategoryValidation.category,
  categoryController.update,
);
router.delete('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, categoryController.delete);
export default router;
