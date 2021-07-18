import { AccountRepository } from '../@types/accountRepo';
import { CategoryRepository } from '../@types/categoryRepo';
import { UserRepository } from '../@types/userRepo';
import { TransactionRepository } from '../@types/transactionRepo';
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

export const getTransactionRepo = (): TransactionRepository => {
  return mongoose.transaction;
};

export const userRepository = getUserRepo();
export const accountRepository = getAccountRepo();
export const categoryRepository = getCategoryRepo();
export const transactionRepository = getTransactionRepo();
