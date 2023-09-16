import mongoose, { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const categorySchema = new Schema(
  {
    nameCategory: {
      type: String,
      required: [true, 'Please enter your nameCategory!'],
      unique: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    books: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'book',
      },
    ],
  },
  { timestamps: true },
);
categorySchema.plugin(paginate);
export default model('category', categorySchema);
