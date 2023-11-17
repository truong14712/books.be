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
      if (data.finish_Date) {
        data.finish_Date = new Date(data.finish_Date);
      }
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
      // Kiểm tra nếu có thời gian khuyến mãi và đã hết thời gian
      if (data.finish_Date && new Date() > data.finish_Date) {
        // Thay đổi trạng thái thành "sắp tới"
        await bookModel.findByIdAndUpdate(book._id, { $set: { status_Date: 'Hoàn thành' } });
      }
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
      // Kiểm tra xem có files ảnh mới được cung cấp không
      if (files && files.length > 0) {
        const imageUrls = await Promise.all(
          files.map(async (value) => {
            return {
              url: value.path,
              publicId: value.filename,
            };
          }),
        );
        data.images = imageUrls;
      }
      data.slug = slugify(data.nameBook);
      if (data.finish_Date) {
        data.finish_Date = new Date(data.finish_Date);
      }
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
      // Kiểm tra nếu có thời gian khuyến mãi và đã hết thời gian
      if (data.finish_Date && new Date() > data.finish_Date) {
        // Thay đổi trạng thái thành "sắp tới"
        await bookModel.findByIdAndUpdate(book._id, { $set: { status_Date: 'Hoàn thành' } });
      }
      if (!book) throw createHttpError(404, 'Not found book');
      if (!newBook) throw createHttpError(400, 'Update failed book');
      if (!category) throw createHttpError(400, 'Update failed category');
      return newBook;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },

  async delete(id) {
    try {
      const book = await bookModel.findById(id);
      if (book.images.length > 0) {
        const ImagesOld = book.images.map((value) => {
          return value.publicId;
        });
        await cloudinary.api.delete_resources(ImagesOld);
      }
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
      const { _limit = 100, _sort = 'nameBook', _order = 'ascend', _page = 1, _q = '' } = query;
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
  async getAllIsHighlighted(query) {
    try {
      const { _limit = 100, _sort = 'nameBook', _order = 'ascend', _page = 1, _q = '' } = query;
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
};

export default bookService;
