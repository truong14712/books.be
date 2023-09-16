import express from 'express';
import authRoute from './authRoute';
import categoryRoute from './categoryRoute';
function route(app) {
  const apiRoutes = express.Router();
  apiRoutes.use('/auth', authRoute);
  apiRoutes.use('/category', categoryRoute);
  app.use('/api', apiRoutes);
}
export default route;
