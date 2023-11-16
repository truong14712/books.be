import reportService from '~/services/report.service';
import ErrorHandler from '~/utils/ErrorHandler';

const reportController = {
  async create(req, res, next) {
    try {
      const data = req.body;
      const report = await reportService.create(data);
      return res.apiResponse(report);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAll(req, res, next) {
    try {
      const query = req.query;
      const reports = await reportService.getAll(query);
      return res.apiResponse(reports);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const report = await reportService.delete(id);
      return res.apiResponse(report);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const report = await reportService.getById(id);
      return res.apiResponse(report);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default reportController;
