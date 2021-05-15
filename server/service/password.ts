import bcrypt from 'bcryptjs';
const PasswordError = require('../error/password');

export const createPasswordHash = async (
  plaintextPassword: string
): Promise<string> => {
  if (!/^[\w!@#$%^&*()-+=]{20,40}$/.test(plaintextPassword)) {
    throw new PasswordError(
      'passwords must be 20 to 40 alphanumeric and !@#$%&*()_-+= characters'
    );
  }
  return bcrypt.hash(
    plaintextPassword,
    parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
  );
};

export const authenticatePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
