import { User } from '../../@types/user';
import { Account } from '../../@types/account';
import { Profile } from '../../@types/profile';
import AccountDocument from '../../model/account';
import MongooseProfile from '../../model/profile';

export const findAll = (user: User): Promise<Account[] | null> => {
  return new Promise((resolve, reject) => {
    try {
      return resolve(user.profiles[0].accounts);
    } catch (err) {
      return reject();
    }
  });
};

export const createAccountForProfile = async (
  profile: Profile,
  data: {
    name: string;
    initialBalance: number;
  }
): Promise<Account> => {
  const accountData = { ...data, currentBalance: data.initialBalance };
  const account = new AccountDocument(accountData);
  const mongooseProfile = await MongooseProfile.findById(profile.id).exec();
  mongooseProfile?.accounts.push(account);
  await mongooseProfile?.save();
  return account.toObject();
};

export const updateAccountForProfile = async (
  account: Account,
  profile: Profile
): Promise<Account | null> => {
  const profileDocument = await MongooseProfile.findById(profile.id);
  const accountDocument = profileDocument?.accounts.id(account.id);
  if (!(accountDocument && profileDocument)) {
    return null;
  }
  accountDocument.set({ ...account });
  await profileDocument.save();
  return accountDocument.toObject();
};
