import { Transaction } from './transaction';

export type EditableTransactionFields = Pick<
  Transaction,
  | 'description'
  | 'amount'
  | 'transactionDate'
  | 'transactionType'
  | 'payerAccount'
> &
  Partial<Pick<Transaction, 'currency' | 'details' | 'payeeAccount'>>;
