import { User } from './user';

export interface UserRepository {
  createUser: (
    data: Pick<User, 'firstName' | 'lastName' | 'email' | 'passwordHash'>
  ) => Promise<User>;

  update: (user: User) => Promise<User | null>;
}
