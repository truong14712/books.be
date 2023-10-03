import createHttpError from 'http-errors';
import slugify from 'slugify';
import { cloudinary } from '~/middlewares/cloudinary.config';
import bookModel from '~/models/bookModel';
import categoryModel from '~/models/categoryModel';
import generateRandomNumber from '~/utils/generateRandomNumber';

const bookService = {
  async create(data, files) {
    try {
      const imageUrls = await Promise.all(
        files.map(async (value) => {
          return {
            url: value.path,
            publicId: value.filename,
          };
        }),
      );
      data.images = imageUrls;
      data.slug = slugify(data.nameBook);
      data.isbn = generateRandomNumber();
      const book = new bookModel(data);
      await book.save();
      const category = await categoryModel.findByIdAndUpdate(
        book.categoryId,
        {
          $addToSet: {
            books: book._id,
          },
        },
        { new: true },
      );
      if (!book) throw createHttpError(400, 'Update failed book');
      if (!category) throw createHttpError(400, 'Update failed category');
      return book;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async update(id, data, files) {
    try {
      const book = await bookModel.findById(id);
      // const ImagesOld = book.images.map((value) => {
      //   return value.publicId;
      // });
      // await cloudinary.api.delete_resources(ImagesOld);
      const imageUrls = await Promise.all(
        files.map(async (value) => {
          return {
            url: value.path,
            publicId: value.filename,
          };
        }),
      );
      data.images = imageUrls;
      data.slug = slugify(data.nameBook);
      const newBook = await bookModel.findByIdAndUpdate(id, data, { new: true });
      const category = await categoryModel.findByIdAndUpdate(
        newBook.categoryId,
        {
          $addToSet: {
            books: newBook._id,
          },
        },
        { new: true },
      );
      if (!book) throw createHttpError(404, 'Not found book');
      if (!newBook) throw createHttpError(400, 'Update failed book');
      if (!category) throw createHttpError(400, 'Update failed category');
      return newBook;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async updateIsHighlighted(id, data) {
    try {
      const { isHighlighted } = data;
      const book = await bookModel.findByIdAndUpdate(id, { isHighlighted: isHighlighted }, { new: true });
      if (!book) throw createHttpError(400, 'Update failed book');
      return book;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },

  async delete(id) {
    try {
      const book = await bookModel.findById(id);
      const ImagesOld = book.images.map((value) => {
        return value.publicId;
      });
      await cloudinary.api.delete_resources(ImagesOld);
      await categoryModel.findByIdAndUpdate(
        book.categoryId,
        {
          $pull: {
            books: book._id,
          },
        },
        { new: true },
      );
      const newBook = await bookModel.findByIdAndDelete(id);
      if (!book) throw createHttpError(404, 'Not found book');
      return newBook;
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
        populate: [{ path: 'categoryId', select: ['_id', 'nameCategory'] }],
        page: _page,
      };
      const book = await bookModel.paginate(
        {
          $or: [
            { nameBook: new RegExp(_q, 'i') },
            { auth: new RegExp(_q, 'i') },
            { 'categoryId.nameCategory': new RegExp(_q, 'i') },
          ],
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
  async getAllIsHighlighted(query) {
    try {
      const { _limit = 100, _sort = 'name', _order = 'ascend', _page = 1, _q = '' } = query;
      const options = {
        sort: { [_sort]: _order === 'descend' ? -1 : 1 },
        limit: _limit,
        populate: [{ path: 'categoryId', select: ['_id', 'nameCategory'] }],
        page: _page,
      };
      const book = await bookModel.paginate(
        {
          $and: [
            { isHighlighted: true },
            {
              $or: [
                { nameBook: new RegExp(_q, 'i') },
                { auth: new RegExp(_q, 'i') },
                { 'categoryId.nameCategory': new RegExp(_q, 'i') },
              ],
            },
          ],
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
  async getById(id) {
    try {
      const book = await bookModel.findById(id).populate({
        path: 'categoryId',
      });
      if (!book) throw createHttpError(404, 'Not found book');
      return book;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async search(query) {
    try {
      const { _limit = 100, _sort = 'name', _order = 'ascend', _page = 1, _q = '' } = query;
      const options = {
        sort: { [_sort]: _order === 'descend' ? -1 : 1 },
        limit: _limit,
        populate: [{ path: 'categoryId', select: ['_id', 'nameCategory'] }],
        page: _page,
      };
      const book = await bookModel
        .find(
          {
            $or: [
              { nameBook: new RegExp(_q, 'i') },
              { auth: new RegExp(_q, 'i') },
              { 'categoryId.nameCategory': new RegExp(_q, 'i') },
            ],
          },
          null,
          options,
        )
        .sort();
      if (!book) throw createHttpError(404, 'Not found book');
      return book;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async searchPrice(query) {
    try {
      const { minPrice, maxPrice } = query;
      const options = {
        populate: [{ path: 'categoryId', select: ['nameCategory', '_id'] }],
      };
      const books = await bookModel
        .find(
          {
            $or: [
              {
                price: { $gte: minPrice, $lte: maxPrice },
              },
            ],
          },
          null,
          options,
        )
        .sort();
      return books;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async searchPublisherName(query) {
    try {
      const { _q } = query;
      const options = {
        populate: [{ path: 'categoryId', select: ['nameCategory', '_id'] }],
      };
      const books = await bookModel.find({ publisher: { $regex: _q, $options: 'i' } }, null, options).sort();
      return books;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async searchAuthName(query) {
    try {
      const { _q } = query;
      const options = {
        populate: [{ path: 'categoryId', select: ['nameCategory', '_id'] }],
      };
      const books = await bookModel.find({ auth: { $regex: _q, $options: 'i' } }, null, options).sort();
      return books;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async searchCoverType(query) {
    try {
      const { _q } = query;
      const options = {
        populate: [{ path: 'categoryId', select: ['nameCategory', '_id'] }],
      };
      const books = await bookModel.find({ coverType: { $regex: _q, $options: 'i' } }, null, options).sort();
      return books;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getAllPublishers() {
    try {
      const books = await bookModel.distinct('publisher');
      return books;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getAllCoverType() {
    try {
      const books = await bookModel.distinct('coverType');
      return books;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getAllAuth() {
    try {
      const books = await bookModel.distinct('auth');
      return books;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default bookService;
