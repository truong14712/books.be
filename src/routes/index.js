import express from 'express';
import authRoute from './authRoute';
function route(app) {
  const apiRoutes = express.Router();
  apiRoutes.use('/auth', authRoute);
  app.use('/api', apiRoutes);
}
export default route;
