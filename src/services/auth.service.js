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
  async getAll(query) {
    try {
      const { _limit = 10, _sort = 'email', _order = 'ascend', _page = 1, _q = '' } = query;

      const options = {
        sort: { [_sort]: _order === 'descend' ? -1 : 1 },
        limit: _limit,
        // populate: [{ path: 'categoryId', select: ['_id'] }],
        page: _page,
      };

      const user = await userModel.paginate(
        {
          firstName: new RegExp(_q, 'i'),
          lastName: new RegExp(_q, 'i'),
          email: new RegExp(_q, 'i'),
        },
        options,
      );

      if (user.docs.length === 0) {
        return [];
      }

      return user;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getOne(id) {
    try {
      const user = await userModel.findById(id).select('-password');

      if (!user) throw createHttpError(404, 'User not found');

      return user;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async deleteUser(id) {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        throw createHttpError(404, 'User not found');
      }
      if (user.role === 'admin') {
        throw createHttpError(400, 'Can not delete admin');
      }
      const deleteUser = await userModel.findByIdAndDelete(id);
      return deleteUser;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default authService;
