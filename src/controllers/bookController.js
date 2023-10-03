import ErrorHandler from '~/utils/ErrorHandler';
import bookService from '~/services/bookService';
const bookController = {
  async create(req, res, next) {
    try {
      const data = req.body;
      const files = req.files;
      const book = await bookService.create(data, files);
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
      const book = await bookService.update(id, data, files);
      return res.apiResponse(book);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async updateIsHighlighted(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const book = await bookService.updateIsHighlighted(id, data);
      return res.apiResponse(book);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const book = await bookService.delete(id);
      return res.apiResponse(book);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAll(req, res, next) {
    try {
      const query = req.query;
      const books = await bookService.getAll(query);
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAllIsHighlighted(req, res, next) {
    try {
      const query = req.query;
      const books = await bookService.getAllIsHighlighted(query);
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const book = await bookService.getById(id);
      return res.apiResponse(book);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async search(req, res, next) {
    try {
      const query = req.query;
      const books = await bookService.search(query);
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async searchPrice(req, res, next) {
    try {
      const query = req.query;
      const books = await bookService.searchPrice(query);
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async searchPublisherName(req, res, next) {
    try {
      const query = req.query;
      const books = await bookService.searchPublisherName(query);
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async searchAuthName(req, res, next) {
    try {
      const query = req.query;
      const books = await bookService.searchAuthName(query);
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async searchCoverType(req, res, next) {
    try {
      const query = req.query;
      const books = await bookService.searchCoverType(query);
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAllPublishers(req, res, next) {
    try {
      const books = await bookService.getAllPublishers();
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAllCoverType(req, res, next) {
    try {
      const books = await bookService.getAllCoverType();
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAllAuth(req, res, next) {
    try {
      const books = await bookService.getAllAuth();
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default bookController;
