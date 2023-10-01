import slugify from 'slugify';
import categoryService from '~/services/categoryService';
import ErrorHandler from '~/utils/ErrorHandler';

const categoryController = {
  async create(req, res, next) {
    try {
      const data = req.body;
      data.slug = slugify(data.nameCategory, { lower: true });
      const category = await categoryService.create(data);
      return res.apiResponse(category);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      data.slug = slugify(data.nameCategory, { lower: true });
      const category = await categoryService.update(id, data);
      return res.apiResponse(category);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.delete(id);
      return res.apiResponse(category);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getAll(req, res, next) {
    try {
      const query = req.query;
      const categories = await categoryService.getAll(query);
      return res.apiResponse(categories);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.getById(id);
      return res.apiResponse(category);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
  async getBooksByCategory(req, res, next) {
    try {
      const { id } = req.params;
      const books = await categoryService.getBooksByCategory(id);
      return res.apiResponse(books);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};
export default categoryController;
