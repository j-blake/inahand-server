const _ = require('lodash');
const express = require('express');
const passwordService = require('../../service/password');
const userService = require('../../service/user');
const sessionService = require('../../service/session');

const router = express.Router();

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

router.post('/auth/create', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // todo simplify and remove custom exception; validate first then create hash
    const hash = await passwordService.createPasswordHash(password);
    const user = await userService.createUser(firstName, lastName, email, hash);
    return res.status(201).json({ user });
  } catch (e) {
    return res.status(400).json({ errors: formatValidationErrors(e) });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const {
      body: { email, password },
    } = req;
    const identity = await userService.findByAuthentication(email, password);
    if (!identity) {
      return res
        .status(401)
        .append(
          'WWW-Authenticate',
          'Bearer realm="Access to inahand data layer" charset="UTF-8"'
        )
        .send();
    }
    const {
      session,
      headers: { 'user-agent': agentHeader },
      connection: { remoteAddress },
    } = req;
    session.identity = identity.id;
    session.userAgent = userService.createUserAgentDocument(
      agentHeader,
      remoteAddress
    );
    await sessionService.saveSession(session);
    return res.status(200).send();
  } catch (e) {
    // todo log error
    return res.status(400).send();
  }
});

router.post('/auth/logout', (req, res) => {
  if (req.session) {
    return req.session.destroy((err) => {
      if (err) {
        // todo log exception
      }
      return res.status(204).clearCookie(process.env.COOKIE_NAME).send();
    });
  }
  return res.status(204).clearCookie(process.env.COOKIE_NAME).send();
});

router.get('/auth/check', async (req, res) => {
  const { session } = req;
  try {
    const identity = await userService.findOneById(session.identity);
    const status = identity ? 204 : 401;
    res.status(status);
  } catch (e) {
    res.status(401);
  }
  return res.send();
});

module.exports = router;
