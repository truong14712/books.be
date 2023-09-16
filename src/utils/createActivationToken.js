import jwt from 'jsonwebtoken';
const createActivationToken = (data) => {
  return jwt.sign(data, process.env.ACTIVATION_SECRET, {
    expiresIn: '1h',
  });
};
export default createActivationToken;
