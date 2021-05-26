import { User } from './user';

export interface UserRepository {
  createUser: (
    data: Pick<User, 'firstName' | 'lastName' | 'email' | 'passwordHash'>
  ) => Promise<User>;

  findById: (id: string) => Promise<User | null>;

  findByEmail: (email: string) => Promise<User | null>;

  update: (user: User) => Promise<User | null>;
}
