import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    // % discount
    discount: {
      type: Number,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    minAmount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
couponSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });
couponSchema.plugin(paginate);
export default model('coupon', couponSchema);
