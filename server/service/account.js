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

exports.add = async (identity, data) => {
  const profile = identity.profiles[0];
  const account = new Account(data);
  account.currentBalance = account.initialBalance;
  await account.save();
  profile.accounts.push(account);
  await profile.save();
  return account;
};

exports.findAccount = async (identity, id) => {
  const profile = identity.profiles[0];
  const { accounts } = profile;
  const account = await Account.find(id);
  return account;
};

/* eslint-disable no-param-reassign */
exports.updateOne = async (account, data) => {
  const { name, currentBalance, isActive } = data;
  if (name) {
    account.name = name;
  }
  if (!Number.isNaN(Number.parseFloat(currentBalance))) {
    account.currentBalance = Number.parseFloat(currentBalance, 10);
  }
  account.isActive = isActive === 'true';
  await account.save();
  return account;
};
