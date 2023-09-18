import express from 'express';
import authRoute from './authRoute';
import categoryRoute from './categoryRoute';
import bookRoute from './bookRoute';
function route(app) {
  const apiRoutes = express.Router();
  apiRoutes.use('/auth', authRoute);
  apiRoutes.use('/category', categoryRoute);
  apiRoutes.use('/book', bookRoute);
  app.use('/api', apiRoutes);
}
export default route;
