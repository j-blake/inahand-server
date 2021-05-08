const Identity = require('../identity');
const Profile = require('../profile');

exports.createUser = (firstName, lastName, email, passwordHash) => {
  const profileDoc = new Profile();
  const identityDoc = new Identity({
    firstName,
    lastName,
    email,
    passwordHash,
    profiles: [profileDoc],
  });
  return identityDoc;
};
