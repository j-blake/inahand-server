import { Account } from '../@types/account';
import { User } from '../@types/user';
import AccountModel, { MongooseAccount } from '../model/account';
import { MongooseIdentity } from '../model/identity';
import { MongooseProfile } from '../model/profile';

export const findAll = async (
  identity: MongooseIdentity
): Promise<Account[] | null> => {
  try {
    await identity
      .populate({
        path: 'profiles',
        populate: { path: 'accounts' },
      })
      .execPopulate();
    return identity.profiles[0].accounts;
  } catch (err) {
    return null;
  }
};

export const add = async (
  identity: User,
  // todo fix - needs to be strings from request
  data: Account
): Promise<Account | null> => {
  const profile = identity.profiles[0];
  const account = new AccountModel(data);
  account.currentBalance = account.initialBalance;
  await account.save();
  profile.accounts.push(account);
  await (profile as MongooseProfile).save();
  return account;
};

// todo fix or remove
export const findAccount = async (
  identity: User,
  id: string
): Promise<Account | undefined> => {
  const profile = identity.profiles[0];
  const { accounts } = profile;
  const account = accounts.find(
    (account) => (account as MongooseAccount).id === id
  );
  return account;
};

export const updateOne = async (
  account: Account,
  // todo fix - needs to be strings from request
  data: Account
): Promise<Account> => {
  const { name, currentBalance, isActive } = data;
  if (name) {
    account.name = name;
  }
  if (!Number.isNaN(Number.parseFloat(currentBalance.toString()))) {
    account.currentBalance = Number.parseFloat(currentBalance.toString());
  }
  account.isActive = ((isActive as unknown) as string) === 'true';
  // todo create repo layer
  await (account as MongooseAccount).save();
  return account;
};
