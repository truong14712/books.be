import Joi from 'joi';

const CategorySchema = {
  category: Joi.object({
    nameCategory: Joi.string().required(),
    description: Joi.string(),
    slug: Joi.string(),
    books: Joi.array().default([]),
  }),
};
export default CategorySchema;
