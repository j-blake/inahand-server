const Identity = require('../identity').default;
const Profile = require('../profile').default;

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
