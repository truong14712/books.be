import createHttpError from 'http-errors';
import bookModel from '~/models/bookModel';
import reportModel from '~/models/reportModel';

const reportService = {
  async create(data) {
    try {
      const report = await reportModel.create(data);
      return report;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getAll(query) {
    try {
      const { _limit = 100, _sort = 'userId', _order = 'ascend', _page = 1, _q = '' } = query;
      const options = {
        sort: { [_sort]: _order === 'descend' ? -1 : 1 },
        limit: _limit,
        populate: [
          {
            path: 'userId',
            select: ['firstName', 'lastName', 'email'],
          },
          {
            path: 'bookId',
            select: ['_id', 'nameBook'],
          },
        ],
        page: _page,
      };
      const report = await reportModel.paginate(
        {
          reason: new RegExp(_q, 'i'),
        },
        options,
      );
      if (report.docs.length === 0) {
        return [];
      }
      return report;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async getById(id) {
    try {
      const report = await reportModel.findById(id).populate('userId').populate('bookId');
      if (!report) throw createHttpError(404, 'Not found report');
      return report;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async delete(id) {
    try {
      const report = await reportModel.findById(id);
      if (!report) throw createHttpError(404, 'Not found report');

      await reportModel.findByIdAndDelete(report._id);
      return report;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
  async deleteReview(id) {
    try {
      const report = await reportModel.findById(id);
      if (!report) throw createHttpError(404, 'Not found report');

      const book = await bookModel.findById(report.bookId);

      book.reviews = book.reviews.filter((review) => review.user._id.toString() !== report.userId.toString());

      const totalRatings = book.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRatings / book.reviews.length;
      book.ratings = averageRating;

      await book.save();
      return book;
    } catch (error) {
      throw createHttpError(500, error);
    }
  },
};
export default reportService;
