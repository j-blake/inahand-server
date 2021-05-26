import { PublicUser } from './publicUser';

export interface User extends PublicUser {
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
