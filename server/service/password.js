const bcrypt = require('bcryptjs');
const PasswordError = require('../error/password');

exports.createPasswordHash = async (plaintextPassword) => {
  try {
    if (!/^[\w!@#$%^&*()-+=]{20,40}$/.test(plaintextPassword)) {
      throw new PasswordError(
        'passwords must be 20 to 40 alphanumeric and !@#$%&*()_-+= characters',
      );
    }
    return await bcrypt.hash(plaintextPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
  } catch (e) {
    throw e;
  }
};

exports.authenticatePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    throw e;
  }
};
