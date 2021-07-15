import { Transaction } from '../../@types/transaction';
import { EditableTransactionFields } from '../../@types/EditableTransactionFields';
import TransactionModel from '../../model/transaction';

export const findByAccount = async (
  accountId: string
): Promise<Transaction[]> => {
  const transactionDocuments = await TransactionModel.find({
    payingAccount: accountId,
  }).exec();
  return transactionDocuments.map(
    (transaction) => (transaction.toObject() as unknown) as Transaction
  );
};

export const create = async (
  data: EditableTransactionFields
): Promise<Transaction> => {
  const transaction = await TransactionModel.create(data);
  return (transaction.toObject() as unknown) as Transaction;
};

export const update = (
  transaction: Transaction,
  data: EditableTransactionFields
): Promise<Transaction> => {
  return Promise.resolve(Object.assign({}, transaction, data) as Transaction);
};

export const deleteTransaction = (
  transactionId: string
): Promise<Transaction> => {
  return Promise.resolve({ id: transactionId } as Transaction);
};

/**
 * findByAccount: (accountId: string) => Promise<Transaction[]>;
  create: (data: EditableTransactionFields) => Promise<Transaction>;
  update: (
    transaction: Transaction,
    data: EditableTransactionFields
  ) => Promise<Transaction>;
  delete: (transactionId: string) => Promise<Transaction>;
 */
