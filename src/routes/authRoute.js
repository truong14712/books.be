import express from 'express';
import AuthController from '~/controllers/authController';
import AuthValidation from '~/validations/authValidation';
import asyncHandler from 'express-async-handler';
import uploadCloud from '~/middlewares/cloudinary.config';

const router = express.Router();
router.post('/register', uploadCloud.single('image'), AuthValidation.register, AuthController.register);
router.post('/login', AuthController.login, AuthController.login);
router.post('/refresh-token', asyncHandler(AuthController.refreshToken));
router.post('/logout', AuthController.logout);
router.post('/activation', AuthController.activation);
export default router;
