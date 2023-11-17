import createHttpError from 'http-errors';
import moment from 'moment';
import orderModel from '~/models/orderModel';

const statisticalService = {
  async calculateTotalRevenue(startDate, endDate) {
    try {
      const start = moment(startDate).startOf('day');
      const end = moment(endDate).endOf('day');

      const result = await orderModel.aggregate([
        {
          $match: {
            status: 'Hoàn thành', // Chỉ lấy các đơn hàng đã hoàn thành
            deliveredAt: { $gte: start.toDate(), $lte: end.toDate() }, // Lọc theo ngày giao hàng
          },
        },
        {
          $unwind: '$cart', // Mở rộng mảng 'cart' để phân tách mỗi mục sách
        },
        {
          $group: {
            _id: { $dateToString: { format: '%d/%m/%Y', date: '$deliveredAt' } },
            totalSoldBooks: { $sum: '$cart.quantity' }, // Tính tổng số lượng sách đã bán
            totalRevenue: { $sum: '$totalPrice' }, // Tính tổng doanh thu
          },
        },
        {
          $sort: { _id: 1 }, // Sắp xếp kết quả theo ngày
        },
      ]);

      return result;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },

  async calculateRevenueByAuthor() {
    try {
      const result = await orderModel.aggregate([
        {
          $match: {
            status: 'Hoàn thành',
          },
        },
        {
          $unwind: '$cart',
        },
        {
          $unwind: '$cart.auth',
        },
        {
          $group: {
            _id: '$cart.auth',
            totalRevenue: {
              $sum: {
                $multiply: [
                  {
                    $cond: {
                      if: { $eq: ['$cart.discountPrice', 0] }, // Nếu discountPrice = 0
                      then: '$cart.price', // Sử dụng giá gốc 'price'
                      else: '$cart.discountPrice', // Ngược lại, sử dụng giá đã giảm giá 'discountPrice'
                    },
                  },
                  '$cart.quantity',
                ],
              },
            },
            totalSoldBooks: { $sum: '$cart.quantity' },
          },
        },
      ]);

      return result;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default statisticalService;
