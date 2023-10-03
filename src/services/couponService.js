import createHttpError from 'http-errors';
import couponModel from '~/models/couponModel';

const couponService = {
  async create(data) {
    try {
      const { code } = data;
      const couponExists = await couponModel.findOne({ code });
      if (couponExists) {
        throw createHttpError(400, 'Coupon already exists');
      }
      const coupon = await couponModel.create(data);
      return coupon;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async update(id, data) {
    try {
      const { code } = data;
      const couponExists = await couponModel.findOne({ code });
      if (couponExists) {
        throw createHttpError(400, 'Coupon already exists');
      }
      const coupon = await couponModel.findByIdAndUpdate(id, data, { new: true });
      if (!coupon) {
        throw createHttpError(404, 'Not found coupon');
      }
      return coupon;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getAll(query) {
    try {
      const { _limit = 100, _sort = 'name', _order = 'ascend', _page = 1, _q = '' } = query;
      const options = {
        sort: { [_sort]: _order === 'descend' ? -1 : 1 },
        limit: _limit,
        populate: [],
        page: _page,
      };
      const book = await couponModel.paginate(
        {
          code: new RegExp(_q, 'i'),
        },
        options,
      );
      if (book.docs.length === 0) {
        return [];
      }
      return book;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getByAdmin(id) {
    try {
      const coupon = await couponModel.find({
        createdBy: id,
      });
      return coupon;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getById(id) {
    try {
      const coupon = await couponModel.findById(id);
      if (!coupon) throw createHttpError(404, 'Not found coupon');
      return coupon;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async delete(id) {
    try {
      const coupon = await couponModel.findByIdAndDelete(id);
      if (!coupon) throw createHttpError(404, 'Not found coupon');
      return coupon;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async applyCoupon(data) {
    try {
      const { code, totalAmount } = data;
      const coupon = await couponModel.findOne({ code });
      if (!coupon) throw createHttpError(404, 'Coupon not found');
      const currentDate = new Date();
      if (currentDate > coupon.expirationDate) {
        // Coupon has expired, handle the error
        throw createHttpError(404, 'Coupon code has expired');
      }
      const minAmount = coupon.minAmount;
      if (totalAmount < minAmount) {
        throw createHttpError(404, 'Total amount does not meet the minimum requirement for this coupon');
      }
      const discount = coupon.discount;
      const discountAmount = (totalAmount * discount) / 100;
      const finalAmount = totalAmount - discountAmount;
      return finalAmount;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default couponService;
