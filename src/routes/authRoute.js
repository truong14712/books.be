import express from 'express';
import AuthController from '~/controllers/authController';
import AuthValidation from '~/validations/authValidation';
import asyncHandler from 'express-async-handler';
import CheckMiddleware from '~/middlewares/checkPermission';
import uploadCloud from '~/middlewares/cloudinary.config';

const router = express.Router();
router.post('/register', uploadCloud.single('image'), AuthValidation.register, AuthController.register);
router.post('/login', AuthController.login, AuthController.login);
router.post('/refresh-token', asyncHandler(AuthController.refreshToken));
router.get('/logout', AuthController.logout);
router.post('/activation', AuthController.activation);
router.put(
  '/changeInformation',
  CheckMiddleware.authentication,
  AuthValidation.changeInformation,
  AuthController.changeInformation,
);
router.put('/changeAvatar', uploadCloud.single('image'), CheckMiddleware.authentication, AuthController.changeAvatar);
router.put(
  '/changePassword',
  CheckMiddleware.authentication,
  AuthValidation.changePassword,
  AuthController.changePassword,
);
router.put('/updateAddress', CheckMiddleware.authentication, AuthController.updateAddress);
router.delete('/deleteAddress/:id', CheckMiddleware.authentication, AuthController.deleteAddress);
export default router;
