const userService = require('./user');

exports.saveSession = (session) => {
  return new Promise((resolve, reject) => {
    session.save((err) => {
      if (err) {
        // log error
        reject(err);
      }
      resolve();
    });
  });
};

exports.destroySession = (session) => {
  return new Promise((resolve, reject) => {
    session.destroy((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

exports.isValidSession = async (session) => userService.findById(session.id);
