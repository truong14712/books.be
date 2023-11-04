import authService from '~/services/auth.service';
import ErrorHandler from '~/utils/ErrorHandler';
import JwtHelpers from '~/utils/jwtToken';
import jwt from 'jsonwebtoken';
import responseStatus from '~/constants/responseStatus';
import createActivationToken from '~/utils/createActivationToken';
import sendMail from '~/utils/sendMail';
import { generateResetToken } from '~/utils/generateResetToken';
import userModel from '~/models/userModel';
import dotenv from 'dotenv';
dotenv.config();
const authController = {
  async register(req, res, next) {
    try {
      const fileData = req.file;
      const data = req.body;
      const user = {
        fileData,
        data,
      };
      const activationToken = createActivationToken(user);
      const activationUrl = `${process.env.URL_CLIENT}/activation/${activationToken}`;
      await sendMail({
        email: user.data.email,
        subject: 'Kích hoạt tài khoản của bạn',
        message: `Chào ${user.data.firstName}${user.data.lastName}, Vui lòng kích vào đây để kích hoạt tài khoản đã đăng ký: ${activationUrl}`,
      });
      return res.status(201).json({
        success: true,
        message: `please check your email:- ${user.data.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async activation(req, res, next) {
    try {
      const activation_token = req.body.activation_token;
      const newUser = await jwt.verify(activation_token, process.env.ACTIVATION_SECRET, {
        expiresIn: '1h',
      });
      if (!newUser) {
        return next(new ErrorHandler('Invalid token', 400));
      }
      const user = await authService.register(newUser);

      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async login(req, res, next) {
    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
    try {
      const data = req.body;
      const user = await authService.login(data);
      const { email, role } = user;
      const payload = { email: email, role: role, id: user._id };
      const [accessToken, refreshToken] = await Promise.all([
        JwtHelpers.signAccessToken(payload),
        JwtHelpers.signRefreshToken(payload),
      ]);
      res.cookie('accessToken', accessToken, cookieOptions);
      return res.apiResponse({ user, accessToken, refreshToken });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async refreshToken(req, res, next) {
    const { refreshToken } = req.body;
    try {
      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      };
      const decoded = refreshToken && (await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET));
      // eslint-disable-next-line no-unused-vars
      const { iat, exp, ...payload } = decoded;

      if (exp < Date.now() / 1000) {
        return res.apiResponse({ code: 401, message: 'Refresh token expired' });
      }
      const accessToken = await JwtHelpers.signAccessToken(payload);
      res.cookie('accessToken', accessToken, options);
      return res.apiResponse({ accessToken });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.apiResponse({ ...responseStatus.UNAUTHORIZED, message: 'Refresh token expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.apiResponse({ code: 401, message: error.message });
      }
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async logout(req, res) {
    res.clearCookie('accessToken');
    return res.apiResponse({
      ...responseStatus.SUCCESS,
      message: 'Log out successfully',
    });
  },
  async changeInformation(req, res, next) {
    try {
      const data = req.body;
      const id = req.user.id;
      const user = await authService.changeInformation(id, data);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async changeAvatar(req, res, next) {
    try {
      const file = req.file;
      const id = req.user.id;
      const user = await authService.changeAvatar(id, file);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAll(req, res, next) {
    try {
      const query = req.query;
      const user = await authService.getAll(query);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getOne(req, res, next) {
    try {
      const id = req.params.id;
      const user = await authService.getOne(id);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async deleteUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await authService.deleteUser(id);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async changePassword(req, res, next) {
    try {
      const data = req.body;
      const id = req.user.id;
      const user = await authService.changePassword(id, data);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async addAddress(req, res, next) {
    try {
      const data = req.body;
      const id = req.user.id;
      const user = await authService.addAddress(id, data);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async updateAddress(req, res, next) {
    try {
      const { addressId, updatedAddressData } = req.body;
      const userId = req.user.id;
      const user = await authService.updateAddress(userId, addressId, updatedAddressData);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async changeAddressStatus(req, res, next) {
    try {
      const data = req.body;
      const id = req.user.id;
      const user = await authService.changeAddressStatus(id, data);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async deleteAddress(req, res, next) {
    try {
      const addressId = req.params.id;
      const id = req.user.id;
      const user = await authService.deleteAddress(id, addressId);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return next(new ErrorHandler('User not found', 500));
      }
      const resetToken = generateResetToken(user);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Thời hạn 1 giờ
      await user.save();
      const resetUrl = `${process.env.URL_CLIENT}/buyer/forgot-password/${resetToken}`;
      await sendMail({
        email: user.email,
        subject: 'Đặt lại mật khẩu',
        message: `Kich vào đây để đặt lại mật khẩu: ${resetUrl}`,
      });
      return res.status(201).json({
        success: true,
        message: `Vui lòng kiểm tra email: ${user.email} để đặt lại mật khẩu!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async resetPassword(req, res, next) {
    try {
      const data = req.body;
      const token = req.params.id;
      const user = await authService.resetPassword(token, data);
      return res.apiResponse(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async loginSuccessGoogle(req, res, next) {
    try {
      const { id } = req.body;
      const user = await authService.loginSuccessGoogle(id);
      const payload = { email: user.email, role: user.role, id: user._id };
      const accessToken = await JwtHelpers.signAccessToken(payload);
      return res.apiResponse({ user, accessToken });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async loginSuccessFacebook(req, res, next) {
    try {
      const { id } = req.body;
      const user = await authService.loginSuccessFacebook(id);
      const payload = { email: user.email, role: user.role, id: user._id };
      const accessToken = await JwtHelpers.signAccessToken(payload);
      return res.apiResponse({ user, accessToken });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default authController;
