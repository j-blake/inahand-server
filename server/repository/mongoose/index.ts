import { RepositoryCollection } from '../../@types/repoCollection';
import { UserRepository } from '../../@types/userRepo';
import * as userRepo from './user';
import * as accountRepo from './account';
import { AccountRepository } from '../../@types/accountRepo';

export default {
  user: userRepo as UserRepository,
  account: accountRepo as AccountRepository,
} as RepositoryCollection;
