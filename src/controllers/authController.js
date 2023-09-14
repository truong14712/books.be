import authService from '~/services/authService';
import ErrorHandler from '~/utils/ErrorHandler';

const authController = {
  async register(req, res, next) {
    try {
      const data = req.body;
      const fileData = req.file;
      const newUser = await authService.regiSter(data, fileData);
      return res.apiResponse(newUser);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default authController;
