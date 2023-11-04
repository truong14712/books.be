/* eslint-disable no-console */

const logApiMiddleware = async (req, res, next) => {
  try {
    const { method, originalUrl } = req;
    console.log('Method ->', method, 'url ->', originalUrl);
    next();
  } catch (error) {
    console.error('Failed to log API request:', error);
    next(error);
  }
};
export default logApiMiddleware;
