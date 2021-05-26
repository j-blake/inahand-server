import { UserRepository } from '../@types/userRepo';
import mongoose from './mongoose';

export const getUserRepo = (): UserRepository => {
  return mongoose.user;
};
