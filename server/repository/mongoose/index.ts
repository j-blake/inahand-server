import { RepositoryCollection } from '../../@types/repoCollection';
import { UserRepository } from '../../@types/userRepo';
import * as userRepo from './user';

export default {
  user: userRepo as UserRepository,
} as RepositoryCollection;
