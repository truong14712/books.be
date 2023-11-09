import AuthSchema from '~/schemas/authSchema.js';
import validateRequest from '~/middlewares/validateRequest.js';

const { register, login, changeInformation, changePassword, addAddress, forgotPassword, resetPassword } = AuthSchema;

const AuthValidation = {
  register: validateRequest(register),
  login: validateRequest(login),
  changeInformation: validateRequest(changeInformation),
  changePassword: validateRequest(changePassword),
  addAddress: validateRequest(addAddress),
  resetPassword: validateRequest(resetPassword),
  forgotPassword: validateRequest(forgotPassword),
};
export default AuthValidation;
