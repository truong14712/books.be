import express from 'express';
import categoryController from '~/controllers/categoryController';
import CategoryValidation from '~/validations/categoryValidation';
import { authentication, authorization } from '~/middlewares/checkPermission';
const router = express.Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', CategoryValidation.category, categoryController.create);
router.put('/:id', CategoryValidation.category, categoryController.update);
router.delete('/:id', categoryController.delete);
export default router;
