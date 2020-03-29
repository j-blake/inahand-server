function PasswordError(message) {
  this.message = message;
}
Object.setPrototypeOf(PasswordError, Error.prototype);
PasswordError.prototype.name = 'PasswordError';
PasswordError.prototype.toJSON = function toJSON() {
  return { errors: { password: { message: this.message, name: this.name } } };
};

module.exports = PasswordError;
