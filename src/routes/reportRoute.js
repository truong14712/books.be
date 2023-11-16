import express from 'express';
import reportController from '~/controllers/reportController';
import ReportValidation from '~/validations/reportValidation';
import CheckMiddleware from '~/middlewares/checkPermission';
const router = express.Router();

router.get('/', CheckMiddleware.authentication, CheckMiddleware.authorization, reportController.getAll);
router.get('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, reportController.getById);
router.post('/', ReportValidation.report, CheckMiddleware.authentication, reportController.create);
router.delete(
  '/deleteReview/:id',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  reportController.deleteReview,
);
router.delete('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, reportController.delete);
export default router;
