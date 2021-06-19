import { Transaction } from './transaction';
import { EditableTransactionFields } from './EditableTransactionFields';

export interface TransactionRepository {
  findByAccount: (accountId: string) => Promise<Transaction[]>;
  create: (data: EditableTransactionFields) => Promise<Transaction>;
  update: (
    transaction: Transaction,
    data: EditableTransactionFields
  ) => Promise<Transaction>;
  deleteTransaction: (transactionId: string) => Promise<Transaction>;
}
