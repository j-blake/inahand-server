const Account = require('../model/account');

exports.findAll = async (req, res) => {
  try {
    const { identity } = req;
    const profile = identity.profiles[0];
    return res.status(200).json({ accounts: profile.accounts });
  } catch (err) {
    return res.status(404).send();
  }
};

exports.add = async (req, res) => {
  try {
    const { identity } = req;
    const profile = identity.profiles[0];
    const account = new Account(req.body);
    account.currentBalance = account.initialBalance;
    await account.save();
    profile.accounts.push(account);
    await profile.save();
    return res.status(201).json({ account });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
};

// todo separate concerns
exports.updateOne = async (req, res) => {
  try {
    const { identity } = req;
    const profile = identity.profiles[0];
    const { accounts } = profile;
    const account = accounts.find(a => a.id === req.params.id);
    if (!account) {
      return res.status(404).send();
    }
    const {
      name = account.name,
      currentBalance = account.currentBalance,
      isActive = account.isActive,
    } = req.body;
    account.name = name || account.name;
    account.currentBalance = Number.isInteger(Number.parseInt(currentBalance, 10))
      ? currentBalance
      : account.currentBalance;
    account.isActive = Boolean(isActive);
    await account.save();
    return res.status(200).json({ account });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
};

exports.deleteOne = async (req, res) => {
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
};
