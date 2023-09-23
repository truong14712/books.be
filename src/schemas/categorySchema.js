import Joi from 'joi';

const CategorySchema = {
  category: Joi.object({
    nameCategory: Joi.string().required(),
    description: Joi.string().required(),
    slug: Joi.string(),
    books: Joi.array().default([]),
  }),
};
export default CategorySchema;
