import { AccountRepository } from './accountRepo';
import { CategoryRepository } from './categoryRepo';
import { TransactionRepository } from './transactionRepo';
import { UserRepository } from './userRepo';

export interface RepositoryCollection {
  user: UserRepository;
  account: AccountRepository;
  category: CategoryRepository;
  transaction: TransactionRepository;
}
