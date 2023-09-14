import createHttpError from 'http-errors';
import userModel from '~/models/userModel';
import bcryptHelpers from '~/utils/bcryptHelpers';
import bcrypt from 'bcrypt';
const authService = {
  async register(data, fileData) {
    const { email, password, ...rest } = data;
    try {
      const findUser = await userModel.findOne({ email });
      if (findUser) throw createHttpError(409, 'Email already exists');
      const hashedPassword = await bcryptHelpers.hashPassword(password);
      const newUser = await userModel.create({
        email,
        password: hashedPassword,
        ...rest,
        avatar: {
          public_id: fileData.filename,
          url: fileData.path,
        },
      });
      if (!newUser) throw createHttpError(500, 'Add user failed');
      newUser.password = undefined;
      return newUser;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async login(data) {
    try {
      const { email, password } = data;
      const findUser = await userModel.findOne({ email });
      if (!findUser) throw createHttpError(404, 'User not found');

      const isPasswordMatch = await bcrypt.compare(password, findUser.password);
      if (!isPasswordMatch) throw createHttpError(401, 'Password is incorrect');
      findUser.password = undefined;
      return findUser;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default authService;
