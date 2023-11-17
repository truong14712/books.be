import express from 'express';
import authRoute from './authRoute';
import categoryRoute from './categoryRoute';
import bookRoute from './bookRoute';
import cartRoute from './cartRoute';
import couponRoute from './couponRoute';
import orderRoute from './orderRoute';
import paypalRoute from './paypalRoute';
import eventRoute from './eventRoute';
import reportRoute from './reportRoute';
import statisticalRoute from './statisticalRoute';
function route(app) {
  const apiRoutes = express.Router();
  apiRoutes.use('/auth', authRoute);
  apiRoutes.use('/category', categoryRoute);
  apiRoutes.use('/book', bookRoute);
  apiRoutes.use('/cart', cartRoute);
  apiRoutes.use('/coupon', couponRoute);
  apiRoutes.use('/order', orderRoute);
  apiRoutes.use('/paypal', paypalRoute);
  apiRoutes.use('/event', eventRoute);
  apiRoutes.use('/report', reportRoute);
  apiRoutes.use('/statistical', statisticalRoute);

  app.use('/api', apiRoutes);
}
export default route;
