import mongoose, { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const bookSchema = new Schema(
  {
    nameBook: {
      type: String,
      required: [true, 'Please enter your nameBook!'],
      unique: true,
    },
    isbn: {
      type: String,
      required: [true, 'Please enter your ISBN!'],
      unique: true,
    },
    auth: {
      type: String,
      required: [true, 'Please enter your auth!'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter your price!'],
    },
    pageNumber: {
      type: Number,
      required: [true, 'Please enter your pageNumber!'],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    publisher: {
      type: String,
      required: [true, 'Please enter your publisher!'],
    },
    publicationYear: {
      type: Number,
      required: [true, 'Please enter your publicationDate!'],
    },
    translator: {
      type: String,
      required: [true, 'Please enter your Translator!'],
    },
    coverType: {
      type: Boolean,
      // paperback:false
      // Hardcover:true
      default: false,
    },
    language: {
      type: String,
      required: [true, 'Please enter your Language!'],
    },
    size: {
      type: String,
      required: [true, 'Please enter your size!'],
    },
    weight: {
      type: Number,
      required: [true, 'Please enter your weight!'],
    },
    status: {
      type: Boolean,
      //
      default: false,
    },
    description: {
      type: String,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: 'category',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true },
);
bookSchema.plugin(paginate);
export default model('book', bookSchema);
