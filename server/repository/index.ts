import { UserRepository } from '../@types/userRepo';
import { AccountRepository } from '../@types/accountRepo';
import mongoose from './mongoose';

export const getUserRepo = (): UserRepository => {
  return mongoose.user;
};

export const getAccountRepo = (): AccountRepository => {
  return mongoose.account;
};
