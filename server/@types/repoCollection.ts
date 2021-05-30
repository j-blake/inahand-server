import { AccountRepository } from './accountRepo';
import { UserRepository } from './userRepo';

export interface RepositoryCollection {
  user: UserRepository;
  account: AccountRepository;
}
