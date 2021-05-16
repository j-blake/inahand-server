import Identity, { MongooseIdentity } from '../identity';
import Profile from '../profile';
import { User } from '../../@types/user';

export function createUser(
  firstName: User['firstName'],
  lastName: User['lastName'],
  email: User['email'],
  passwordHash: User['passwordHash']
): MongooseIdentity {
  const profileDoc = new Profile();
  const identityDoc = new Identity({
    firstName,
    lastName,
    email,
    passwordHash,
    profiles: [profileDoc],
  });
  return identityDoc;
}
