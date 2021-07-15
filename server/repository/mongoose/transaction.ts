import { Transaction } from '../../@types/transaction';
import { EditableTransactionFields } from '../../@types/EditableTransactionFields';
import TransactionModel from '../../model/transaction';
import { Profile } from '../../@types/profile';

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

export const findOneByProfile = async (
  id: string,
  profile: Profile
): Promise<Transaction | null> => {
  const transaction = await TransactionModel.findOne({
    _id: id,
    payingAccount: { $in: profile.accounts.map((account) => account.id) },
  }).exec();
  if (!transaction) {
    return null;
  }
  return (transaction.toObject() as unknown) as Transaction;
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
