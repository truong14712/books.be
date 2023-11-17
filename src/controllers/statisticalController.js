import statisticalService from '~/services/statistical.service';
import ErrorHandler from '~/utils/ErrorHandler';
const statisticalController = {
  async calculateTotalRevenue(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const result = await statisticalService.calculateTotalRevenue(startDate, endDate);
      return res.apiResponse(result);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async calculateRevenueByAuthor(req, res, next) {
    try {
      const result = await statisticalService.calculateRevenueByAuthor();
      return res.apiResponse(result);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default statisticalController;
