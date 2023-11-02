import mongoose, { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    books: [
      {
        bookId: {
          type: mongoose.Types.ObjectId,
          ref: 'book',
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, 'Quantity can not be less then 1.'],
        },
      },
    ],
  },
  { timestamps: true },
);
cartSchema.plugin(paginate);
export default model('cart', cartSchema);
