import CategorySchema from '~/schemas/categorySchema.js';
import validateRequest from '~/middlewares/validateRequest.js';

const { category } = CategorySchema;

const CategoryValidation = {
  category: validateRequest(category),
};
export default CategoryValidation;
