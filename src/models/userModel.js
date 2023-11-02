import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please enter your firstName!'],
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your lastName!'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email!'],
      unique: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    addresses: [
      {
        country: {
          type: String,
        },
        state: {
          type: String,
        },
        city: {
          type: String,
        },
        address: {
          type: String,
        },
        zipCode: {
          type: Number,
        },
        addressType: {
          type: String,
        },
        // Giá trị mặc định là true
        status: {
          type: Boolean,
          default: false,
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
    withdrawMethod: {
      type: Object,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    typeLogin: {
      type: String,
      enum: ['local', 'facebook', 'google'],
      required: true,
      default: 'local',
    },
  },
  { timestamps: true },
);
userSchema.plugin(paginate);
export default model('user', userSchema);
