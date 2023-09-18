import BookSchema from '~/schemas/bookSchema';
import validateRequest from '~/middlewares/validateRequest.js';

const { book } = BookSchema;

const BookValidation = {
  book: validateRequest(book),
};
export default BookValidation;
