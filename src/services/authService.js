import createHttpError from 'http-errors';
import userModel from '~/models/userModel';
import bcryptHelpers from '~/utils/bcryptHelpers';

const authService = {
  async regiSter(data, fileData) {
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
};
export default authService;
