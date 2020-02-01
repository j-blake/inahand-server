const bcrypt = require('bcrypt');

exports.createPasswordHash = async (plaintextPassword) => {
  try {
    return await bcrypt.hash(plaintextPassword, process.env.BCRYPT_SALT_ROUNDS);
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
