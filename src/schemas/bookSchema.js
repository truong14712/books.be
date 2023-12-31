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
    coverType: Joi.string().required(),
    language: Joi.string().required(),
    size: Joi.string(),
    status: Joi.boolean().default(false),
    weight: Joi.number(),
    brand: Joi.string(),
    reviews: Joi.array().items(Joi.object()),
    ratings: Joi.number(),
    sold_out: Joi.number(),
    discountPrice: Joi.number().required(),
    description: Joi.string(),
    isHighlighted: Joi.boolean().default(false),
  }),
};
export default BookSchema;
