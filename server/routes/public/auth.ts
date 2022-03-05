import { forEach } from 'lodash';
import { Request, Response, Router } from 'express';
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
import { SerializableError } from '../../@types/serializableError';
import { Session } from '../../@types/session';

const router = Router();

// todo [IN-6] standardize error response
function formatValidationErrors(e: SerializableError) {
  const errors = {} as {
    [path: string]: string;
  };
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
    return res
      .status(400)
      .json({ errors: formatValidationErrors(e as SerializableError) });
  }
});

router.post('/auth/login', async (req: Request, res: Response) => {
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
      headers: { 'user-agent': agentHeader },
      socket: { remoteAddress },
    } = req;
    const session: Session = req.session as Session;
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
      await destroySession(session as Session);
    } catch (e) {
      // todo log error
    }
  }
  return res.status(204).clearCookie(process.env.COOKIE_NAME).send();
});

router.get('/auth/check', async (req, res) => {
  const { session } = req;
  try {
    const isValid = await isValidSession(session as Session);
    res.status(isValid ? 204 : 401);
  } catch (e) {
    res.status(401);
  }
  return res.send();
});

export default router;
