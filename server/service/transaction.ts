import { EditableTransactionFields } from '../@types/EditableTransactionFields';
import { Profile } from '../@types/profile';
import { Transaction } from '../@types/transaction';
import TransactionModel from '../model/transaction';
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

export default class TransactionService {
  static async findAll() {
    return Transaction.find();
  }
  // static async findOne(req, res) {
  //   try {
  //     const transaction = await Transaction.findById(req.params.id).exec();
  //     if (transaction === null) {
  //       return res.status(404).send();
  //     }
  //     return res.status(200).json({ transaction });
  //   } catch (err) {
  //     const { message } = err;
  //     return res.status(400).json({ message });
  //   }
  // }

  static async add(data: { amount: number; description: string }) {
    const transaction = new Transaction(data);
    await transaction.save();
    return transaction;
  }

  // static async updateOne(req, res) {
  //   try {
  //     const transaction = await Transaction.findById(req.params.id).exec();
  //     if (transaction === null) {
  //       return res.status(404).send();
  //     }
  //     const {
  //       description = transaction.description,
  //       transactionDate = transaction.transactionDate,
  //       payingAccount = transaction.payingAccount,
  //       receivingAccount = transaction.receivingAccount,
  //     } = req.body;
  //     transaction.description = description || transaction.description;
  //     transaction.transactionDate =
  //       transactionDate instanceof Date
  //         ? transactionDate
  //         : transaction.transactionDate;
  //     transaction.payingAccount = payingAccount || transaction.payingAccount;
  //     transaction.receivingAccount = receivingAccount || transaction.receivingAccount;
  //     await transaction.save();
  //     return res.status(200).json({ transaction });
  //   } catch (err) {
  //     const { message } = err;
  //     return res.status(400).json({ message });
  //   }
  // }

  // static async deleteOne(req, res) {
  //   try {
  //     const transaction = await Transaction.findById(req.params.id).exec();
  //     if (transaction === null) {
  //       return res.status(404).send();
  //     }
  //     await transaction.remove();
  //     return res.status(204).send();
  //   } catch (err) {
  //     const { message } = err;
  //     return res.status(400).json({ message });
  //   }
  // }
}
