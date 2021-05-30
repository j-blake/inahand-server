import { Account } from '../@types/account';
import { User } from '../@types/user';
import { getAccountRepo } from '../repository';

export const findAll = async (identity: User): Promise<Account[] | null> => {
  const repo = getAccountRepo();
  const accounts = await repo.findAll(identity);
  return accounts;
};

export const create = async (
  identity: User,
  data: { name: string; initialBalance: number }
): Promise<Account | null> => {
  const repo = getAccountRepo();
  const profile = identity.profiles[0];
  const account = await repo.createAccountForProfile(profile, data);
  return account;
};

export const findAccount = async (
  identity: User,
  id: string
): Promise<Account | undefined> => {
  const profile = identity.profiles[0];
  const { accounts } = profile;
  const account = accounts.find((account) => account.id === id);
  return account;
};

export const update = async (
  identity: User,
  account: Account,
  data: Partial<{ name: string; currentBalance: number; isActive: boolean }>
): Promise<Account | null> => {
  const profile = identity.profiles[0];
  const { name, currentBalance, isActive } = data;
  account.name = name ?? account.name;
  account.currentBalance = currentBalance ?? account.currentBalance;
  account.isActive = isActive !== undefined ? isActive : account.isActive;
  const repo = getAccountRepo();
  return repo.updateAccountForProfile(account, profile);
};
