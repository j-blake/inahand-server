import { AccountRepository } from '../../@types/accountRepo';
import { CategoryRepository } from '../../@types/categoryRepo';
import { RepositoryCollection } from '../../@types/repoCollection';
import { UserRepository } from '../../@types/userRepo';
import { TransactionRepository } from '../../@types/transactionRepo';
import * as accountRepo from './account';
import * as categoryRepo from './category';
import * as transactionRepo from './transaction';
import * as userRepo from './user';

export default {
  user: userRepo as UserRepository,
  account: accountRepo as AccountRepository,
  category: categoryRepo as CategoryRepository,
  transaction: transactionRepo as TransactionRepository,
} as RepositoryCollection;
