import { AccountRepository } from '../../@types/accountRepo';
import { RepositoryCollection } from '../../@types/repoCollection';
import { UserRepository } from '../../@types/userRepo';
import * as accountRepo from './account';
import * as userRepo from './user';
import * as categoryRepo from './category';
import { CategoryRepository } from '../../@types/categoryRepo';

export default {
  user: userRepo as UserRepository,
  account: accountRepo as AccountRepository,
  category: categoryRepo as CategoryRepository,
} as RepositoryCollection;
