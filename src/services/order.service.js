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
  async getAllOrderUser(userId) {
    try {
      const order = await orderModel
        .find({
          userId,
        })
        .sort({ createdAt: -1 });
      if (!order) throw createHttpError(404, 'Not found order');
      return order;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async restoreOrder(id) {
    const order = await orderModel.findById(id).lean();
    if (!order) throw createHttpError(404, 'Not found order');

    const cartExists = await cartModel.findOne({ userId: order.userId });

    if (cartExists) {
      // Giỏ hàng đã tồn tại, cần cập nhật thông tin sách
      const updatedBooks = order.cart.map((item) => ({
        bookId: item._id,
        quantity: item.quantity,
      }));

      for (const updatedBook of updatedBooks) {
        const existingBook = cartExists.books.find((book) => String(book.bookId) === String(updatedBook.bookId));
        if (existingBook) {
          // Nếu sách đã tồn tại trong giỏ hàng, cập nhật số lượng
          existingBook.quantity += updatedBook.quantity;
        } else {
          // Nếu sách chưa tồn tại, thêm sách mới vào giỏ hàng
          cartExists.books.push(updatedBook);
        }
      }

      await cartExists.save();
      return cartExists;
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới
      const newCart = {
        userId: order.userId,
        books: order.cart.map((item) => ({
          bookId: item._id,
          quantity: item.quantity,
        })),
      };

      const createdCart = await cartModel.create(newCart);
      return createdCart;
    }
  },
  async refundOrder(data, id) {
    try {
      const { status } = data;
      const order = await orderModel.findById(id);
      if (!order) throw createHttpError(404, 'Not found order');
      order.status = status;
      await order.save({ validateBeforeSave: false });
      return order;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async refundOrderSuccess(data, id) {
    const { status } = data;
    const order = await orderModel.findById(id);
    if (!order) throw createHttpError(404, 'Not found order');
    async function updateOrder(id, quantity) {
      const book = await bookModel.findById(id);

      book.stock += quantity;
      book.sold_out -= quantity;

      await book.save({ validateBeforeSave: false });
    }

    if (status === 'Trả hàng/Hoàn tiền') {
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.quantity);
      });
    }
    order.status = status;

    await order.save();
    return order;
  },
};
export default orderService;
