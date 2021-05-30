import { AccountRepository } from './accountRepo';
import { CategoryRepository } from './categoryRepo';
import { UserRepository } from './userRepo';

export interface RepositoryCollection {
  user: UserRepository;
  account: AccountRepository;
  category: CategoryRepository;
}
