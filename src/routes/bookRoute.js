import express from 'express';
import bookController from '~/controllers/bookController';
import bookValidation from '~/validations/bookValidation';
import CheckMiddleware from '~/middlewares/checkPermission';
import uploadCloud from '~/middlewares/cloudinary.config';
const router = express.Router();

router.get('/', bookController.getAll);
router.get('/getAllIsHighlighted', bookController.getAllIsHighlighted);
router.get('/getAllPublishers', bookController.getAllPublishers);
router.get('/getAllCoverType', bookController.getAllCoverType);
router.get('/getAllAuth', bookController.getAllAuth);
router.get('/search', bookController.search);
router.get('/searchPrice', bookController.searchPrice);
router.get('/searchPublisherName', bookController.searchPublisherName);
router.post('/searchProductReviewsAllUsers', bookController.searchProductReviewsAllUsers);
router.get('/searchAuthName', bookController.searchAuthName);
router.get('/searchCoverType', bookController.searchCoverType);
router.get('/:id', bookController.getById);
router.post(
  '/',
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  uploadCloud.array('images'),
  bookValidation.book,
  bookController.create,
);
router.put(
  '/:id',
  uploadCloud.array('images'),
  CheckMiddleware.authentication,
  CheckMiddleware.authorization,
  bookValidation.book,
  bookController.update,
);
router.patch('/createNewReview', CheckMiddleware.authentication, bookController.createNewReview);
router.delete('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, bookController.delete);
export default router;
