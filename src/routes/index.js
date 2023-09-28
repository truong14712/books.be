import express from 'express';
import authRoute from './authRoute';
import categoryRoute from './categoryRoute';
import bookRoute from './bookRoute';
import cartRoute from './cartRoute';
import couponRoute from './couponRoute';
function route(app) {
  const apiRoutes = express.Router();
  apiRoutes.use('/auth', authRoute);
  apiRoutes.use('/category', categoryRoute);
  apiRoutes.use('/book', bookRoute);
  apiRoutes.use('/cart', cartRoute);
  apiRoutes.use('/coupon', couponRoute);
  app.use('/api', apiRoutes);
}
export default route;
