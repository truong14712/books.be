/* eslint-disable no-console */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import responseStatus from '~/constants/responseStatus';
import userModel from '~/models/userModel';
import ErrorHandler from '~/utils/ErrorHandler';

dotenv.config();

const CheckMiddleware = {
  async authentication(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return next(new ErrorHandler('Please login to continue', 401));
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return next(new ErrorHandler('Invalid token!', 401));
      }
      const { ACCESS_TOKEN_SECRET } = process.env;
      jwt.verify(token, ACCESS_TOKEN_SECRET, async (error, payload) => {
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(400).json({
            message: 'JsonWebTokenError',
          });
        }
        if (error instanceof jwt.TokenExpiredError) {
          return res.status(400).json({
            message: 'TokenExpiredError',
          });
        }
        const user = await userModel.findById(payload.id);
        if (!user)
          return next(new ErrorHandler(responseStatus.UNAUTHORIZED.message, responseStatus.UNAUTHORIZED.status));
        req.user = user;
        next();
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(200).json({ code: 401, message: error.message });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(200).json({ code: 401, message: error.message });
      }
      next(error);
    }
  },
  async authorization(req, res, next) {
    try {
      const user = req.user;
      if (user.role !== 'admin') {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resources `,
            responseStatus.FORBIDDEN.status,
          ),
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  },
};
export default CheckMiddleware;
