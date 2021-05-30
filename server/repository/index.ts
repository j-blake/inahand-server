import { AccountRepository } from '../@types/accountRepo';
import { CategoryRepository } from '../@types/categoryRepo';
import { UserRepository } from '../@types/userRepo';
import mongoose from './mongoose';

export const getUserRepo = (): UserRepository => {
  return mongoose.user;
};

export const getAccountRepo = (): AccountRepository => {
  return mongoose.account;
};

export const getCategoryRepo = (): CategoryRepository => {
  return mongoose.category;
};
