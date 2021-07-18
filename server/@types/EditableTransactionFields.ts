import { Transaction } from './transaction';

export type EditableTransactionFields = Pick<
  Transaction,
  | 'description'
  | 'amount'
  | 'transactionDate'
  | 'transactionType'
  | 'payingAccount'
> &
  Partial<Pick<Transaction, 'currency' | 'details' | 'receivingAccount'>>;
