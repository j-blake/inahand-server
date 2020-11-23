const bcrypt = require('bcryptjs');
const PasswordError = require('../error/password');

exports.createPasswordHash = async (plaintextPassword) => {
  if (!/^[\w!@#$%^&*()-+=]{20,40}$/.test(plaintextPassword)) {
    throw new PasswordError(
      'passwords must be 20 to 40 alphanumeric and !@#$%&*()_-+= characters'
    );
  }
  return bcrypt.hash(
    plaintextPassword,
    parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
  );
};

exports.authenticatePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
