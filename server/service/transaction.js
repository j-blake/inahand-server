const Transaction = require('../model/transaction');

class TransactionService {
  static async findAll(req, res) {
    try {
      const transactions = await Transaction.find();
      return res.status(200).json({ transactions });
    } catch (err) {
      return res.status(404).send();
    }
  }

  static async findOne(req, res) {
    try {
      const transaction = await Transaction.findById(req.params.id).exec();
      if (transaction === null) {
        return res.status(404).send();
      }
      return res.status(200).json({ transaction });
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }

  static async add(req, res) {
    try {
      const transaction = new Transaction(req.body);
      await transaction.save();
      return res.status(201).json({ transaction });
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }

  static async updateOne(req, res) {
    try {
      const transaction = await Transaction.findById(req.params.id).exec();
      if (transaction === null) {
        return res.status(404).send();
      }
      const {
        description = transaction.description,
        transactionDate = transaction.transactionDate,
        payerAccount = transaction.payerAccount,
        payeeAccount = transaction.payeeAccount,
      } = req.body;
      transaction.description = description || transaction.description;
      transaction.transactionDate =
        transactionDate instanceof Date
          ? transactionDate
          : transaction.transactionDate;
      transaction.payerAccount = payerAccount || transaction.payerAccount;
      transaction.payeeAccount = payeeAccount || transaction.payeeAccount;
      await transaction.save();
      return res.status(200).json({ transaction });
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }

  static async deleteOne(req, res) {
    try {
      const transaction = await Transaction.findById(req.params.id).exec();
      if (transaction === null) {
        return res.status(404).send();
      }
      await transaction.remove();
      return res.status(204).send();
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }
}

module.exports = TransactionService;
