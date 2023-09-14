/* eslint-disable no-console */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DATABASE_NAME}`);
    console.log('Database connected!');
  } catch (error) {
    console.log(error.message);
    process.exit(0);
  }
};
export default connectDb;
