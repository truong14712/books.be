import createHttpError from 'http-errors';
import categoryModel from '~/models/categoryModel';

const categoryService = {
  async create(data) {
    try {
      const category = await categoryModel.create(data);
      if (!category) throw createHttpError(400, 'Not found category');
      return category;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async update(id, data) {
    try {
      const category = await categoryModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!category) throw createHttpError(404, 'Not found category');
      return category;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async delete(id) {
    try {
      const category = await categoryModel.findByIdAndDelete(id);
      if (!category) throw createHttpError(404, 'Not found category');
      return category;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getAll(query) {
    try {
      const { _limit = 100, _sort = 'nameCategory', _order = 'ascend', _page = 1, _q = '' } = query;
      const options = {
        sort: { [_sort]: _order === 'descend' ? -1 : 1 },
        limit: _limit,
        populate: [{ path: 'books', select: ['_id', 'nameBook'] }],
        page: _page,
      };
      const categories = await categoryModel.paginate(
        {
          nameCategory: new RegExp(_q, 'i'),
        },
        options,
      );
      if (categories.docs.length === 0) {
        return [];
      }
      return categories;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getById(id) {
    try {
      const category = await categoryModel.findById(id).populate('books');
      if (!category) throw createHttpError(404, 'Not found category');
      return category;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getBooksByCategory(id) {
    try {
      const category = await categoryModel.findById(id).populate('books');
      if (!category) {
        throw createHttpError(404, 'Category not found');
      }
      return category.books;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default categoryService;
