import { User } from '../../@types/user';
import Profile from '../../model/profile';
import Identity from '../../model/identity';
import { PublicUser } from '../../@types/publicUser';

export const createUser = async (
  data: Pick<User, 'firstName' | 'lastName' | 'email' | 'passwordHash'>
): Promise<User> => {
  const identityDoc = await Identity.create({
    ...data,
    profiles: [new Profile()],
  });
  return identityDoc.toObject();
};

export const findById = async (id: string): Promise<User | null> => {
  const identity = await Identity.findById(id).exec();
  return identity?.toObject() ?? null;
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const identity = await Identity.findOne({ email }).exec();
  return identity?.toObject() ?? null;
};

// todo test if/when user routes are created
export const update = async (user: PublicUser): Promise<User | null> => {
  const { firstName, lastName, email } = user;
  const identity = await Identity.findByIdAndUpdate(user.id, {
    firstName,
    lastName,
    email,
  }).exec();
  if (identity === null) {
    throw new Error(`Unable to update identity document: ${user.id}`);
  }
  return identity as User;
};
