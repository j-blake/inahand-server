const bcrypt = require('bcrypt');

exports.createPasswordHash = async (plaintextPassword) => {
  try {
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
