import { Transaction } from '../../@types/transaction';
import { EditableTransactionFields } from '../../@types/EditableTransactionFields';
import TransactionModel from '../../model/transaction';
import TransactionDetailsModel from '../../model/transactionDetails';
import { Profile } from '../../@types/profile';
import mongoose from 'mongoose';

export const findByAccount = async (
  accountId: string
): Promise<Transaction[]> => {
  const transactionDocuments = await TransactionModel.find({
    payingAccount: accountId,
  }).exec();
  return transactionDocuments.map(
    (transaction) => transaction.toObject() as unknown as Transaction
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
  return transaction.toObject() as unknown as Transaction;
};

export const create = async (
  data: EditableTransactionFields
): Promise<Transaction> => {
  const transaction = await TransactionModel.create(data);
  return transaction.toObject() as unknown as Transaction;
};

export const update = async (
  transactionId: string,
  data: EditableTransactionFields
): Promise<Transaction | null> => {
  const {
    description,
    amount,
    transactionDate,
    transactionType,
    currency,
    details,
    payingAccount,
    receivingAccount,
  } = data;
  const document = await TransactionModel.findById(transactionId);
  if (document === null) {
    return null;
  }
  document.description = description;
  document.amount = amount;
  document.transactionDate = transactionDate;
  document.transactionType = transactionType;
  document.currency = currency || 'USD';
  document.payingAccount = new mongoose.Schema.Types.ObjectId(payingAccount);
  if (receivingAccount) {
    document.receivingAccount = new mongoose.Schema.Types.ObjectId(
      receivingAccount
    );
  }
  const detailsDocuments = details?.map(
    (detail) => new TransactionDetailsModel(detail)
  );
  document.details = detailsDocuments;
  await document.save();
  return document.toObject() as unknown as Transaction;
};

export const deleteTransaction = async (
  transactionId: string
): Promise<Transaction | null> => {
  const transaction = await TransactionModel.findByIdAndDelete(
    transactionId
  ).exec();
  if (transaction === null) {
    return null;
  }
  return transaction.toObject() as unknown as Transaction;
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
