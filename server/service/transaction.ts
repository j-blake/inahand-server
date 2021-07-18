import { EditableTransactionFields } from '../@types/EditableTransactionFields';
import { Profile } from '../@types/profile';
import { Transaction } from '../@types/transaction';
import { transactionRepository } from '../repository';
import {
  fetchIsoCurrency,
  convertToMinorUnits,
  convertToMajorUnits,
} from '../util/currency';

export const findAccountTransactionsByProfile = async (
  profile: Profile,
  accountId: string
): Promise<Transaction[]> => {
  const account = profile.accounts.find((account) => account.id === accountId);
  if (account === undefined) {
    return Promise.resolve([]);
  }
  const transactions = await transactionRepository.findByAccount(account.id);
  await Promise.all(
    transactions.map(async (transaction) => {
      const currency = await fetchIsoCurrency(transaction.currency || '');
      if (currency === null) {
        transaction.amount = 0;
        transaction.details?.forEach((detail) => (detail.amount = 0));
      } else {
        transaction.amount = convertToMajorUnits(transaction.amount, currency);
        transaction.details?.forEach(
          (detail) =>
            (detail.amount = convertToMajorUnits(detail.amount, currency))
        );
      }
    })
  );
  return transactions;
};

export const findTransactionByProfile = async (
  id: string,
  profile: Profile
): Promise<Transaction | null> => {
  const accounts = profile.accounts;
  if (accounts.length === 0) {
    return Promise.resolve(null);
  }
  const transaction = await transactionRepository.findOneByProfile(id, profile);
  if (transaction === null) {
    return null;
  }
  const currency = await fetchIsoCurrency(transaction.currency || '');
  if (currency === null) {
    transaction.amount = 0;
    transaction.details?.forEach((detail) => (detail.amount = 0));
  } else {
    transaction.amount = convertToMajorUnits(transaction.amount, currency);
    transaction.details?.forEach(
      (detail) => (detail.amount = convertToMajorUnits(detail.amount, currency))
    );
  }
  return transaction;
};

export const createTransaction = async (
  data: EditableTransactionFields,
  profile: Profile
): Promise<Transaction> => {
  const { payingAccount, receivingAccount } = data;
  const accounts = profile.accounts;
  const accountIds = accounts.map((account) => account.id);
  if (!accountIds.includes(payingAccount)) {
    throw new Error('Paying account does not exist');
  }
  if (receivingAccount && !accountIds.includes(receivingAccount)) {
    throw new Error('Receiving account does not exist');
  }
  const currency = await fetchIsoCurrency(data.currency || '');
  if (currency === null) {
    throw new Error(
      `Currency for ${data.currency || '(NO CURRENCY PROVIDED)'} does not exist`
    );
  }
  data.amount = convertToMinorUnits(data.amount, currency);
  data.details?.forEach(
    (detail) => (detail.amount = convertToMinorUnits(detail.amount, currency))
  );
  return await transactionRepository.create(data);
};

export const updateTransaction = async (
  transactionId: string,
  data: EditableTransactionFields,
  profile: Profile
): Promise<Transaction | null> => {
  const accounts = profile.accounts;
  const accountIds = accounts.map((account) => account.id);
  const { payingAccount, receivingAccount } = data;
  if (!accountIds.includes(payingAccount)) {
    throw new Error('Paying account does not exist');
  }
  if (receivingAccount && !accountIds.includes(receivingAccount)) {
    throw new Error('Receiving account does not exist');
  }
  const currency = await fetchIsoCurrency(data.currency || '');
  if (currency === null) {
    throw new Error(
      `Currency for ${data.currency || '(NO CURRENCY PROVIDED)'} does not exist`
    );
  }
  data.amount = convertToMinorUnits(data.amount, currency);
  data.details?.forEach(
    (detail) => (detail.amount = convertToMinorUnits(detail.amount, currency))
  );
  const transaction = await transactionRepository.findOneByProfile(
    transactionId,
    profile
  );
  if (transaction === null) {
    return null;
  }
  return await transactionRepository.update(transaction.id, data);
};

export const deleteTransaction = async (
  transactionId: string,
  profile: Profile
): Promise<Transaction | null> => {
  const transaction = await transactionRepository.findOneByProfile(
    transactionId,
    profile
  );
  if (transaction === null) {
    return null;
  }
  const deletedTransaction = await transactionRepository.deleteTransaction(
    transaction.id
  );
  return deletedTransaction;
};
