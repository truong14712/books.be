import AuthSchema from '~/schemas/authSchema.js';
import validateRequest from '~/middlewares/validateRequest.js';

const { register, login, changeInformation, changePassword, updateAddress } = AuthSchema;

const AuthValidation = {
  register: validateRequest(register),
  login: validateRequest(login),
  changeInformation: validateRequest(changeInformation),
  changePassword: validateRequest(changePassword),
  updateAddress: validateRequest(updateAddress),
};
export default AuthValidation;
