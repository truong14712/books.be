import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JwtHelpers = {
  async signAccessToken(payload) {
    // Hàm sign trong thư viện jsonwebtoken dùng để tạo một JSON Web Token (JWT) từ một object và một khóa bí mật.
    try {
      // const results = await Promise.all([function1(), function2()]);
      const accessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5h',
      });

      return accessToken;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  },
  async signRefreshToken(payload) {
    // Hàm sign trong thư viện jsonwebtoken dùng để tạo một JSON Web Token (JWT) từ một object và một khóa bí mật.
    try {
      const refreshToken = await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d',
      });
      return refreshToken;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  },
};
export default JwtHelpers;
