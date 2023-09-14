import express from 'express';
import AuthController from '~/controllers/authController';
import AuthValidation from '~/validations/authValidation';
import asyncHandler from 'express-async-handler';
import uploadCloud from '~/middlewares/cloudinary.config';

const router = express.Router();
router.post('/register', uploadCloud.single('image'), AuthValidation.register, AuthController.register);

export default router;
