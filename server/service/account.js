const Account = require('../model/account');

class AccountService {
  static async findAll(req, res) {
    try {
      const accounts = await Account.find();
      return res.status(200).json({ accounts });
    } catch (err) {
      return res.status(404).send();
    }
  }

  static async findOne(req, res) {
    try {
      const account = await Account.findById(req.params.id).exec();
      if (account === null) {
        return res.status(404).send();
      }
      return res.status(200).json({ account });
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }

  static async add(req, res) {
    try {
      const account = new Account(req.body);
      account.currentBalance = account.initialBalance;
      await account.save();
      return res.status(201).json({ account });
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }

  static async updateOne(req, res) {
    try {
      const account = await Account.findById(req.params.id).exec();
      if (account === null) {
        return res.status(404).send();
      }
      const {
        name = account.name,
        currentBalance = account.currentBalance,
        isActive = account.isActive,
      } = req.body;
      account.name = name || account.name;
      account.currentBalance = Number.isInteger(currentBalance)
        ? currentBalance
        : account.currentBalance;
      account.isActive = Boolean(isActive);
      await account.save();
      return res.status(200).json({ account });
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }

  static async deleteOne(req, res) {
    try {
      const account = await Account.findById(req.params.id).exec();
      if (account === null) {
        return res.status(404).send();
      }
      await account.remove();
      return res.status(204).send();
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }
}

module.exports = AccountService;
