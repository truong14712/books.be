import AuthSchema from '~/schemas/authSchema.js';
import validateRequest from '~/middlewares/validateRequest.js';

const { register, login } = AuthSchema;

const AuthValidation = {
  register: validateRequest(register),
  login: validateRequest(login),
};
export default AuthValidation;
