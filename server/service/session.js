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
