import { User } from './user';
import { Account } from './account';
import { Profile } from './profile';

export interface AccountRepository {
  findAll: (user: User) => Promise<Account[] | null>;
  findOne: (id: string, user: User) => Promise<Account | null>;
  createAccountForProfile: (
    profile: Profile,
    data: {
      name: string;
      initialBalance: number;
    }
  ) => Promise<Account>;
  updateAccountForProfile: (
    account: Account,
    profile: Profile
  ) => Promise<Account | null>;
}
