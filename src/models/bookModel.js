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
    // originalPrice
    price: {
      type: Number,
      required: [true, 'Please enter your price!'],
    },
    discountPrice: {
      type: Number,
      required: [true, 'Please enter your discount price!'],
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
      type: String,
      required: [true, 'Please enter your CoverType!'],
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
      required: [true, 'Please enter your book stock!'],
    },
    brand: {
      type: String,
    },
    reviews: [
      {
        user: {
          type: Object,
        },
        rating: {
          type: Number,
        },
        comment: {
          type: String,
        },
        bookId: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    ratings: {
      type: Number,
    },
    sold_out: {
      type: Number,
      default: 0,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
bookSchema.plugin(paginate);
export default model('book', bookSchema);
