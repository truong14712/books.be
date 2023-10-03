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
      const { _limit = 10, _sort = 'name', _order = 'ascend', _page = 1, _q = '' } = query;

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
  async changePassword(id, data) {
    try {
      const { password, newPassword } = data;

      const user = await userModel.findById(id);
      const isCurrentPasswordValid = await bcrypt.compare(password, user.password);

      if (!isCurrentPasswordValid) throw createHttpError(401, 'Current password is incorrect');

      const hashedPassword = await bcryptHelpers.hashPassword(newPassword);

      const newUser = await userModel
        .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
        .select('-password');

      if (!user) throw createHttpError(404, 'User not found');

      return newUser;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async updateAddress(id, data) {
    try {
      const user = await userModel.findById(id);
      const sameTypeAddress = user.addresses.find((address) => address.addressType === data.addressType);

      if (sameTypeAddress) {
        throw createHttpError(400, 'Address already exists');
      }

      const existsAddress = user.addresses.find((address) => address._id === data._id);

      if (existsAddress) {
        Object.assign(existsAddress, data);
      } else {
        // add the new address to the array
        user.addresses.push(data);
      }

      if (!user) throw createHttpError(404, 'User not found');
      await user.save();

      return user;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async deleteAddress(id, data) {
    try {
      const userId = id;
      const addressId = data;
      await userModel.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } },
      );

      const user = await userModel.findById(userId);

      return user;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default authService;
