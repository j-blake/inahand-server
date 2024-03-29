import { User } from '../../@types/user';
import Profile from '../../model/profile';
import Identity from '../../model/identity';
import { PublicUser } from '../../@types/publicUser';

export const createUser = async (
  data: Pick<User, 'firstName' | 'lastName' | 'email' | 'passwordHash'>
): Promise<User | null> => {
  const profile = new Profile();
  const identityDoc = new Identity({
    ...data,
    profiles: [profile],
  });
  const session = await Identity.startSession();
  await session.withTransaction(async () => {
    await profile.save({ session });
    await identityDoc.save({ session });
  });
  session.endSession();
  return identityDoc?.toObject<User>() ?? null;
};

export const findById = async (id: string): Promise<User | null> => {
  const identity = await Identity.findById(id)
    .populate({ path: 'profiles' })
    .exec();
  if (identity === null) {
    return null;
  }
  return identity?.toObject<User>();
};

export const findByEmail = async (
  emailAddress: string
): Promise<User | null> => {
  const identity = await Identity.findOne({ email: emailAddress })
    .select('+passwordHash')
    .exec();
  if (identity === null) {
    return null;
  }
  return identity?.toObject<User>();
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
  return identity?.toObject<User>();
};
