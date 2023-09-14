import bcrypt from 'bcrypt';

const bcryptHelpers = {
  hashPassword(password) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const hashPassword = await bcrypt.hash(password, 10);
        resolve(hashPassword);
      } catch (e) {
        reject(e);
      }
    });
  },
};
export default bcryptHelpers;
