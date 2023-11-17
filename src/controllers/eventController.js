import ErrorHandler from '~/utils/ErrorHandler';
import eventService from '~/services/event.service';
const eventController = {
  async create(req, res, next) {
    try {
      const data = req.body;
      const files = req.files;
      const book = await eventService.create(data, files);
      return res.apiResponse(book);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const files = req.files;
      const book = await eventService.update(id, data, files);
      return res.apiResponse(book);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const book = await eventService.delete(id);
      return res.apiResponse(book);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAll(req, res, next) {
    try {
      const query = req.query;
      const books = await eventService.getAll(query);
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const book = await eventService.getById(id);
      return res.apiResponse(book);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default eventController;
