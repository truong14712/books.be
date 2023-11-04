import express from 'express';
import AuthController from '~/controllers/authController';
import AuthValidation from '~/validations/authValidation';
import asyncHandler from 'express-async-handler';
import CheckMiddleware from '~/middlewares/checkPermission';
import uploadCloud from '~/middlewares/cloudinary.config';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import '../middlewares/passport.js';
const router = express.Router();
// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`${process.env.URL_CLIENT}/buyer/login-success-google/${req.user?.googleId}`);
  },
);

// Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));

router.get(
  '/facebook/callback',
  (req, res, next) => {
    passport.authenticate('facebook', (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`${process.env.URL_CLIENT}/buyer/login-success-facebook/${req.user?.facebookId}`);
  },
);

router.post('/login-success-google', AuthController.loginSuccessGoogle);
router.post('/login-success-facebook', AuthController.loginSuccessFacebook);
router.get('/', CheckMiddleware.authentication, CheckMiddleware.authorization, AuthController.getAll);
router.get('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, AuthController.getOne);
router.post('/register', uploadCloud.single('image'), AuthValidation.register, AuthController.register);
router.post('/login', AuthController.login, AuthController.login);
router.post('/forgotPassword', AuthValidation.forgotPassword, AuthController.forgotPassword);
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
router.patch('/resetPassword/:id', AuthValidation.resetPassword, AuthController.resetPassword);
router.patch('/addAddress', CheckMiddleware.authentication, AuthController.addAddress, AuthValidation.addAddress);
router.patch('/updateAddress', CheckMiddleware.authentication, AuthController.updateAddress);
router.patch('/changeAddressStatus', CheckMiddleware.authentication, AuthController.changeAddressStatus);
router.delete('/:id', CheckMiddleware.authentication, CheckMiddleware.authorization, AuthController.deleteUser);
router.delete('/deleteAddress/:id', CheckMiddleware.authentication, AuthController.deleteAddress);
export default router;
