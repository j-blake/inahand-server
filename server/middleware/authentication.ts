import { NextFunction, Response } from 'express';
import { Request } from '../@types/request';
import { Session } from '../@types/session';
import { findById } from '../service/user';

function handleUnauthorizedResponse(res: Response) {
  return res
    .status(401)
    .append(
      'WWW-Authenticate',
      'Bearer realm="Access to inahand data layer" charset="UTF-8"'
    )
    .send();
}

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const session: Session = req.session as Session;
  if (!session) {
    return handleUnauthorizedResponse(res);
  }
  let identity = null;
  try {
    identity = await findById(session.identity);
  } catch (e) {
    // do nothing
  }
  if (!identity) {
    return handleUnauthorizedResponse(res);
  }
  req.identity = identity;
  return next();
};
