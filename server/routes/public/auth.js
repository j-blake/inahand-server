import { forEach } from 'lodash';
import { Router } from 'express';
import { createPasswordHash } from '../../service/password';
import {
  createUser,
  findByAuthentication,
  createUserAgentDocument,
} from '../../service/user';
import {
  saveSession,
  destroySession,
  isValidSession,
} from '../../service/session';

const router = Router();

function formatValidationErrors(e) {
  const errors = {};
  try {
    forEach(e.toJSON().errors, (value, path) => {
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
    const hash = await createPasswordHash(password);
    const user = await createUser(firstName, lastName, email, hash);
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
    const identity = await findByAuthentication(email, password);
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
    session.userAgent = createUserAgentDocument(agentHeader, remoteAddress);
    await saveSession(session);
    return res.status(200).send();
  } catch (e) {
    // todo log error
    return res.status(400).send();
  }
});

router.post('/auth/logout', async (req, res) => {
  const { session } = req;
  if (session) {
    try {
      await destroySession(session);
    } catch (e) {
      // todo log error
    }
  }
  return res.status(204).clearCookie(process.env.COOKIE_NAME).send();
});

router.get('/auth/check', async (req, res) => {
  const { session } = req;
  try {
    const status = (await isValidSession(session)) ? 204 : 401;
    res.status(status);
  } catch (e) {
    res.status(401);
  }
  return res.send();
});

export default router;
