import authService from '~/services/authService';
import ErrorHandler from '~/utils/ErrorHandler';
import JwtHelpers from '~/utils/jwtToken';
import jwt from 'jsonwebtoken';
import responseStatus from '~/constants/responseStatus';
const authController = {
  async register(req, res, next) {
    try {
      const data = req.body;
      const fileData = req.file;
      const newUser = await authService.register(data, fileData);
      return res.apiResponse(newUser);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async login(req, res, next) {
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };
    try {
      const data = req.body;
      const user = await authService.login(data);
      const { email, role } = user;
      const payload = { email: email, role: role };
      const [accessToken, refreshToken] = await Promise.all([
        JwtHelpers.signAccessToken(payload),
        JwtHelpers.signRefreshToken(payload),
      ]);
      res.cookie('accessToken', accessToken, options);
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
};
export default authController;
