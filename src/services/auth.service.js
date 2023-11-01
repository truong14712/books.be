import createHttpError from 'http-errors';
import userModel from '~/models/userModel';
import bcryptHelpers from '~/utils/bcryptHelpers';
import bcrypt from 'bcrypt';
import { cloudinary } from '~/middlewares/cloudinary.config';
const authService = {
  async register(data) {
    const { email, password, ...rest } = data.data;
    try {
      const findUser = await userModel.findOne({ email });
      if (findUser) throw createHttpError(409, 'Email already exists');
      const hashedPassword = await bcryptHelpers.hashPassword(password);
      const newUser = await userModel.create({
        email,
        password: hashedPassword,
        ...rest,
        avatar: {
          public_id: data.fileData.filename,
          url: data.fileData.path,
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

      const findUser = await userModel.findOne({ email }).select('+password');

      if (!findUser) throw createHttpError(404, 'User not found');

      const isPasswordMatch = await bcrypt.compare(password, findUser.password);

      if (!isPasswordMatch) throw createHttpError(401, 'Password is incorrect');
      findUser.password = undefined;
      return findUser;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async changeInformation(id, data) {
    try {
      const { avatar, email, role, password, ...rest } = data;

      const user = userModel.findByIdAndUpdate(id, { ...rest }, { new: true }).select({ password: 0 });

      if (!user) throw createHttpError(400, 'update failed');

      return user;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async changeAvatar(id, file) {
    try {
      const user = await userModel.findById(id).select({ password: 0 });

      if (!user) throw createHttpError(404, 'User not found');

      await cloudinary.uploader.destroy(user.avatar.public_id);

      user.avatar.public_id = file.filename;
      user.avatar.url = file.path;

      await user.save();
      return user;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default authService;
