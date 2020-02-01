const _ = require('lodash');
const uuid = require('uuid/v4');
const useragent = require('useragent');
const jwt = require('jsonwebtoken');

const passwordService = require('./password');
const Identity = require('../model/identity');
const Session = require('../model/session');

exports.createLogin = async (req, res) => {
  try {
    const hash = await passwordService.createPasswordHash(req.body.password);
    const body = _.pick(req.body, ['firstName', 'lastName', 'email']);
    const identity = new Identity(body);
    identity.passwordHash = hash;
    await identity.save();
    const responseIdentity = _.pick(identity, ['firstName', 'lastName', 'email']);
    return res.status(201).json(responseIdentity);
  } catch (e) {
    return res.status(400).send(e);
  }
};

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
    const session = new Session();
    session.uuid = uuid();
    const agent = useragent.parse(agentHeader);
    session.userAgent = {
      agent: agent.toString(),
      os: agent.os.toString(),
      device: agent.device.toString(),
    };
    session.ipAddress = remoteAddress;
    identity.sessions.push(session);
    await identity.save();
    // eslint-disable-next-line no-underscore-dangle
    const token = jwt.sign({ userId: identity._id }, process.env.JWT_TOKEN, { expiresIn: '5m', algorithm: 'HS256' });
    return res
      .status(200)
      .cookie('inahand_session', session.uuid, {
        expires: new Date(Date.now() + 600000), // 10 minutes from now
        httpOnly: true,
        signed: true,
        secure: true,
      })
      .json(token);
  } catch (e) {
    return res.status(400).send(e);
  }
};
