/* eslint-disable no-console */
import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/mongodb';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import route from './routes';
import options from './config/cors';
import errorHandler from './middlewares/errorHandler';
dotenv.config();
const app = express();
const hostname = 'localhost' || process.env.APP_HOST;
const port = 8000 || process.env.APP_PORT;

app.use(cookieParser());
app.use(cors({ options }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// route(app);
app.all('*', (req, res, next) => {
  const err = new Error('The route can not be found');
  err.statusCode = 404;
  next(err);
});
app.use(errorHandler);
app.listen(port, hostname, () => {
  console.log(`Hello Min Tru Dev, I am running at ${hostname}:${port}`);
});
connectDb();
