import jwt from 'jsonwebtoken';
export function generateResetToken(user) {
  const token = jwt.sign({ user }, process.env.ACTIVATION_SECRET, {
    expiresIn: '1h',
  });
  return token;
}
