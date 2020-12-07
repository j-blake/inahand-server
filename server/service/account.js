const Account = require('../model/account');

exports.findAll = async (identity) => {
  try {
    await identity
      .populate({
        path: 'profiles',
        populate: { path: 'accounts' },
      })
      .execPopulate();
    return identity.profiles[0].accounts;
  } catch (err) {
    return null;
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
