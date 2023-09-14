import express from 'express';

function route(app) {
  const apiRoutes = express.Router();
  apiRoutes.use('/users');
  app.use('/api', apiRoutes);
}
export default route;
