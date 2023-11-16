import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const reportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'book',
      required: true,
    },
    reason: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true },
);
reportSchema.plugin(paginate);
export default model('report', reportSchema);
