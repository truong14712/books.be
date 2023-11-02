import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const orderSchema = new Schema(
  {
    orderId: {
      type: String,
    },

    cart: {
      type: Array,
      required: true,
    },

    shippingAddress: {
      type: Object,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    shippingFee: {
      type: Number, // Assuming the shipping fee is a number
      default: 0, // Giá trị mặc định có thể thay đổi tùy theo yêu cầu của bạn
    },

    status: {
      type: String,
      default: 'Đang xử lý',
    },

    reason: {
      type: String,
    },

    paymentInfo: {
      status: {
        type: String,
      },
      type: {
        type: String,
      },
    },

    paidAt: {
      type: Date,
      default: Date.now(),
    },

    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);
orderSchema.plugin(paginate);
export default model('order', orderSchema);
