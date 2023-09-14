import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please enter your name!'],
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email!'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
    },
    phoneNumber: {
      type: Number,
    },
    addresses: [
      {
        country: {
          type: String,
        },
        city: {
          type: String,
        },
        address1: {
          type: String,
        },
        address2: {
          type: String,
        },
        zipCode: {
          type: Number,
        },
        addressType: {
          type: String,
        },
      },
    ],
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        default: 'https://res.cloudinary.com/diqyzhuc2/image/upload/v1683285518/hoaUi/icon_sacea8-removebg_gkhuzj.png',
      },
    },
  },
  { timestamps: true },
);
export default model('user', userSchema);
