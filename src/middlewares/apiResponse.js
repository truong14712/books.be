// Tạo middleware để xử lý việc trả về dữ liệu API
import responseStatus from '~/constants/responseStatus.js';

const apiResponse = (req, res, next) => {
  res.apiResponse = function (data = [], statusObj = responseStatus.SUCCESS) {
    const response = {
      ...statusObj,
      data,
    };
    const statusCode = response.status || 200;

    return res.status(statusCode).json(response);
  };

  next();
};
export default apiResponse;
