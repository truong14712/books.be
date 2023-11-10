import createHttpError from 'http-errors';
import bookModel from '~/models/bookModel';
import cartModel from '~/models/cartModel';
import orderModel from '~/models/orderModel.js';
import userModel from '~/models/userModel';
import { generateRandomCode } from '~/utils/generateRandomString';
const orderService = {
  async create(data) {
    try {
      const order = await orderModel.create({
        orderId: generateRandomCode(15),
        ...data,
      });
      if (!order) {
        throw createHttpError(400, 'Order failed');
      }
      return order;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async updateOrderStatus(id, data, userId) {
    const { status } = data;
    const order = await orderModel.findById(id);
    async function updateOrder(id, quantity) {
      const book = await bookModel.findById(id);

      book.stock -= quantity;
      book.sold_out += quantity;

      await book.save();
    }

    async function updateAdminInfo(amount) {
      const admin = await userModel.findById(userId);

      admin.availableBalance = amount;

      await admin.save();
    }

    if (!order) throw createHttpError(404, 'Not found order');

    if (status === 'Vận chuyển') {
      order.status = 'Vận chuyển';
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.quantity);
      });
    }

    if (status === 'Hoàn thành') {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = 'Thành công';
      order.status = 'Hoàn thành';
      const serviceCharge = order.totalPrice * 0.1;
      await updateAdminInfo(order.totalPrice - serviceCharge);
    }

    if (status === 'Đang giao') {
      order.status = 'Đang giao';
    }

    await order.save();
    return order;
  },
  async cancelOrder(data, id) {
    const order = await orderModel.findById(id);
    if (!order) {
      throw createHttpError(404, 'Not found order');
    }
    order.deliveredAt = Date.now();
    order.reason = data.reason;
    order.status = 'Đã hủy';
    await order.save();

    return order;
  },

  async getAll(query) {
    try {
      const { _limit = 100, _sort = 'deliveredAt', _order = 'ascend', _page = 1, _q = '' } = query;
      const options = {
        sort: { [_sort]: _order === 'descend' ? -1 : 1 },
        limit: _limit,
        populate: [{ path: 'userId', select: ['firstName', 'lastName', 'email'] }],
        page: _page,
      };
      const order = await orderModel.paginate(
        {
          $or: [
            { status: new RegExp(_q, 'i') },
            { 'cart.nameBook': new RegExp(_q, 'i') },
            {
              orderId: new RegExp(_q, 'i'),
            },
          ],
        },
        options,
      );
      if (order.docs.length === 0) {
        return [];
      }
      return order;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },

  async searchOrderUser(userId, query) {
    try {
      const { _limit = 100, _sort = 'deliveredAt', _order = 'ascend', _page = 1, _q = '' } = query;
      const options = {
        sort: { [_sort]: _order === 'descend' ? -1 : 1 },
        limit: _limit,
        populate: [{ path: 'userId', select: ['firstName', 'lastName', 'email'], match: { _id: userId } }],
        page: _page,
      };
      const order = await orderModel.paginate(
        {
          $or: [
            { status: new RegExp(_q, 'i') },
            { 'cart.nameBook': new RegExp(_q, 'i') },
            {
              orderId: new RegExp(_q, 'i'),
            },
          ],
          userId: userId,
        },
        options,
      );
      if (order.docs.length === 0) {
        return [];
      }
      return order;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getById(id) {
    try {
      const order = await orderModel.findById(id);
      if (!order) throw createHttpError(404, 'Not found order');
      return order;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default orderService;
