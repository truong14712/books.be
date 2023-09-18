import Joi from 'joi';

const BookSchema = {
  book: Joi.object({
    nameBook: Joi.string().required(),
    isbn: Joi.string(),
    auth: Joi.string().required(),
    price: Joi.number().required(),
    pageNumber: Joi.number().required(),
    images: Joi.array().items(Joi.object()),
    categoryId: Joi.string().required(),
    slug: Joi.string(),
    stock: Joi.number(),
    publisher: Joi.string().required(),
    publicationYear: Joi.number().required(),
    translator: Joi.string().required(),
    coverType: Joi.boolean(),
    language: Joi.string().required(),
    size: Joi.string(),
    status: Joi.boolean(),
    description: Joi.string(),
    weight: Joi.number(),
  }),
};
export default BookSchema;
