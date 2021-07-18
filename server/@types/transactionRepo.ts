import { Transaction } from './transaction';
import { EditableTransactionFields } from './EditableTransactionFields';
import { Profile } from './profile';

export interface TransactionRepository {
  findByAccount: (accountId: string) => Promise<Transaction[]>;
  findOneByProfile: (
    id: string,
    profile: Profile
  ) => Promise<Transaction | null>;
  create: (data: EditableTransactionFields) => Promise<Transaction>;
  update: (
    transactionId: string,
    data: EditableTransactionFields
  ) => Promise<Transaction>;
  deleteTransaction: (transactionId: string) => Promise<Transaction>;
}
