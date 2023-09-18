import express from 'express';
import bookController from '~/controllers/bookController';
import bookValidation from '~/validations/bookValidation';
import { authentication, authorization } from '~/middlewares/checkPermission';
import uploadCloud from '~/middlewares/cloudinary.config';
const router = express.Router();

router.get('/', bookController.getAll);
router.get('/:id', bookController.getById);
router.post('/', uploadCloud.array('images'), bookValidation.book, bookController.create);
router.put('/:id', uploadCloud.array('images'), bookValidation.book, bookController.update);
router.delete('/:id', bookController.delete);
export default router;
