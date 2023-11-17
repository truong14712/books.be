import express from 'express';
import eventController from '~/controllers/eventController';
import bookValidation from '~/validations/bookValidation';
import CheckMiddleware from '~/middlewares/checkPermission';
import uploadCloud from '~/middlewares/cloudinary.config';
const router = express.Router();

router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.post(
  '/',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  uploadCloud.array('images'),
  eventController.create,
);
router.put(
  '/:id',
  uploadCloud.array('images'),
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  eventController.update,
);
router.delete('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, eventController.delete);
export default router;
