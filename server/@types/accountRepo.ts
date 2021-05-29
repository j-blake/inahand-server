import { User } from './user';
import { Account } from './account';
import { Profile } from './profile';

export interface AccountRepository {
  findAll: (user: User) => Promise<Account[] | null>;
  createAccountForProfile: (
    profile: Profile,
    data: {
      name: string;
      initialBalance: number;
    }
  ) => Promise<Account>;
  updateAccount: (
    account: Account,
    data: Partial<{ name: string; currentBalance: number; isActive: boolean }>
  ) => Promise<Account | null>;
}
