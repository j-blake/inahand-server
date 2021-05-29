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

export const updateAccount = async (
  account: Account,
  data: Partial<{ name: string; currentBalance: number; isActive: boolean }>
): Promise<Account | null> => {
  const profile = await MongooseProfile.findOne({ 'accounts._id': account.id });
  const accountDocument = profile?.accounts.id(account.id);
  if (!accountDocument) {
    return null;
  }
  const { name, currentBalance, isActive } = data;
  accountDocument.name = name ?? accountDocument.name;
  accountDocument.currentBalance =
    currentBalance ?? accountDocument.currentBalance;
  accountDocument.isActive =
    isActive !== undefined ? isActive : accountDocument.isActive;
  await profile?.save();
  return accountDocument.toObject();
};
