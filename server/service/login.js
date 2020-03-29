const _ = require('lodash');
const uuid = require('uuid/v4');
const useragent = require('useragent');
const jwt = require('jsonwebtoken');

const passwordService = require('./password');
const Identity = require('../model/identity');
const Session = require('../model/session');
const identityService = require('../service/identity');

function formatValidationErrors(e) {
  const errors = {};
  _.forEach(e.toJSON().errors, (value, path) => {
    errors[path] = value.message;
  });
  return errors;
}

exports.createIdentity = async (req, res) => {
  try {
    const hash = await passwordService.createPasswordHash(req.body.password);
    const body = _.pick(req.body, ['firstName', 'lastName', 'email']);
    const identity = new Identity({ ...body, passwordHash: hash });
    await identity.save();
    return res.status(201).json({ user: identity.toObject() });
  } catch (e) {
    return res.status(400).json({ errors: formatValidationErrors(e) });
  }
};

function createSession(agentHeader, remoteAddress) {
  const session = new Session();
  session.uuid = uuid();
  const agent = useragent.parse(agentHeader);
  session.userAgent = {
    agent: agent.toString(),
    os: agent.os.toString(),
    device: agent.device.toString(),
  };
  session.ipAddress = remoteAddress;
  return session;
}

exports.authenticateLogin = async (req, res) => {
  try {
    const { body: { email, password }, headers: { 'user-agent': agentHeader }, connection: { remoteAddress } } = req;
    const identity = await Identity.findOne({ email }).exec();
    const isAuthenticated = await passwordService.authenticatePassword(
      password,
      identity.passwordHash,
    );
    if (!isAuthenticated) {
      return res
        .status(401)
        .append('WWW-Authenticate', 'Bearer realm="Access to inahand data layer" charset="UTF-8"')
        .send();
    }
    const session = createSession(agentHeader, remoteAddress);
    identity.sessions.push(session);
    await identity.save({ validateBeforeSave: false });
    // eslint-disable-next-line no-underscore-dangle
    const token = jwt.sign({ userId: identity._id }, process.env.JWT_TOKEN, { expiresIn: '5m', algorithm: 'HS256' });
    return res
      .status(200)
      .cookie(process.env.COOKIE_NAME, session.uuid, {
        expires: new Date(Date.now() + 600000), // 10 minutes from now
        httpOnly: true,
        signed: true,
        secure: true,
      })
      .json({ token });
  } catch (e) {
    return res.status(400).send(e);
  }
};

exports.logout = async (req, res) => {
  const cookie = req.signedCookies[process.env.COOKIE_NAME];
  try {
    const identity = await identityService.findOneBySession(cookie);
    identity.sessions = [];
    await identity.save({ validateBeforeSave: false });
    return res.status(204).clearCookie(process.env.COOKIE_NAME).send();
  } catch (e) {
    return res.status(400).send(e);
  }
};

exports.refreshSession = async (req, res) => {
  const cookie = req.signedCookies[process.env.COOKIE_NAME];
  try {
    const identity = await identityService.findOneBySession(cookie);
    if (!identity) {
      return res.status(404).send();
    }
    const validSessions = identity.sessions.filter(session => session.uuid !== cookie);
    const { headers: { 'user-agent': agentHeader }, connection: { remoteAddress } } = req;
    const newSession = createSession(agentHeader, remoteAddress);
    validSessions.push(newSession);
    identity.sessions = validSessions;
    await identity.save({ validateBeforeSave: false });
    return res
      .status(200)
      .cookie(process.env.COOKIE_NAME, newSession.uuid, {
        expires: new Date(Date.now() + 600000), // 10 minutes from now
        httpOnly: true,
        signed: true,
        secure: true,
      })
      .send();
  } catch (e) {
    return res.status(400).send(e);
  }
};
