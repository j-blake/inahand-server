const _ = require('lodash');
const useragent = require('useragent');

const passwordService = require('./password');
const Identity = require('../model/identity');
const Profile = require('../model/profile');
const identityService = require('../service/identity');

function formatValidationErrors(e) {
  const errors = {};
  try {
    _.forEach(e.toJSON().errors, (value, path) => {
      errors[path] = value.message;
    });
  } catch (err) {
    // log error
  }

  return errors;
}

exports.createIdentity = async (req, res) => {
  try {
    const hash = await passwordService.createPasswordHash(req.body.password);
    const body = _.pick(req.body, ['firstName', 'lastName', 'email']);
    const profile = new Profile();
    const identity = new Identity({ ...body, passwordHash: hash, profiles: [profile] });
    await profile.save();
    await identity.save();
    return res.status(201).json({ user: identity.toObject() });
  } catch (e) {
    return res.status(400).json({ errors: formatValidationErrors(e) });
  }
};

function createUserAgentDocument(agentHeader, remoteAddress) {
  const agent = useragent.parse(agentHeader);
  const userAgent = {
    agent: agent.toString(),
    os: agent.os.toString(),
    device: agent.device.toString(),
    ipAddress: remoteAddress,
  };
  return userAgent;
}

exports.authenticateLogin = async (req, res) => {
  try {
    const { body: { email, password }, headers: { 'user-agent': agentHeader }, connection: { remoteAddress } } = req;
    const identity = await identityService.findOneByEmailNoPopulate(email);
    const { passwordHash: hash } = identity;
    const isAuthenticated = await passwordService.authenticatePassword(password, hash);
    if (!isAuthenticated) {
      return res
        .status(401)
        .append('WWW-Authenticate', 'Bearer realm="Access to inahand data layer" charset="UTF-8"')
        .send();
    }
    req.session.identity = identity.id;
    req.session.userAgent = createUserAgentDocument(agentHeader, remoteAddress);
    return req.session.save((err) => {
      if (err) {
        return res.status(400).send();
      }
      return res.status(200).send();
    });
  } catch (e) {
    return res.status(400).send(e);
  }
};

exports.logout = function logout(req, res) {
  if (req.session) {
    return req.session.destroy((err) => {
      if (err) {
        // todo log this
      }
      return res.status(204).clearCookie(process.env.COOKIE_NAME).send();
    });
  }
  return res.status(204).clearCookie(process.env.COOKIE_NAME).send();
};
