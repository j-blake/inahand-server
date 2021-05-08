const useragent = require('useragent');

const passwordService = require('./password');
const userFactory = require('../model/factory/user');
const Identity = require('../model/identity');

exports.findById = async (id) => {
  const identity = await Identity.findById(id).exec();
  return identity;
};

exports.createUser = async (firstName, lastName, email, hash) => {
  try {
    const identity = userFactory.createUser(firstName, lastName, email, hash);
    await identity.save();
    return identity;
  } catch (e) {
    // todo log error
    return null;
  }
};

exports.findByAuthentication = async (email, password) => {
  try {
    const identity = await Identity.findOne({ email }).exec();
    if (!identity) {
      return null;
    }
    const { passwordHash: hash } = identity;
    const isAuthenticated = await passwordService.authenticatePassword(
      password,
      hash
    );
    if (!isAuthenticated) {
      return null;
    }
    return identity;
  } catch (e) {
    // todo log exception
    return null;
  }
};

exports.createUserAgentDocument = (agentHeader, remoteAddress) => {
  const agent = useragent.parse(agentHeader);
  return {
    agent: agent.toString(),
    os: agent.os.toString(),
    device: agent.device.toString(),
    ipAddress: remoteAddress,
  };
};
