// Đã Tồn tại : 409 vd:User đã tồn tại
// Lỗi server : 500 vd:Thêm mới thất bại

const responseStatus = {
  // Sử dụng khi GET một tài nguyên
  SUCCESS: {
    isSuccess: true,
    status: 200,
    message: 'Thành công !',
  },
  // Sử dụng khi tạo một tài nguyên
  CREATED: {
    isSuccess: true,
    status: 201,
    message: 'Created !',
  },
  ACCEPTED: {
    isSuccess: true,
    status: 202,
    message: 'Accepted !',
  },
  // Thường sử dụng khi xóa một tài nguyên
  NO_CONTENT: {
    isSuccess: true,
    status: 204,
    message: 'No Content',
  },
  // BAD_REQUEST
  BAD_REQUEST: {
    isSuccess: false,
    status: 400,
    message: 'Bad Request',
  },
  // Được sử dụng khi yêu cầu không được ủy quyền, yêu cầu yêu cầu xác thực hoặc token không hợp lệ.
  UNAUTHORIZED: {
    isSuccess: false,
    status: 401,
    message: 'Unauthorized !',
  },
  FORBIDDEN: {
    isSuccess: false,
    status: 403,
    message: 'Forbidden',
  },

  NOT_FOUND: {
    isSuccess: false,
    status: 404,
    message: 'Not Found',
  },
  // Được sử dụng khi có lỗi xảy ra phía máy chủ, không thể xác định rõ nguyên nhân cụ thể.
  INTERNAL_SERVER_ERROR: {
    isSuccess: false,
    status: 500,
    message: 'Internal Server Error',
  },
};
export default responseStatus;
