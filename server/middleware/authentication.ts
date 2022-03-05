import { NextFunction, Response } from 'express';
import { Request } from '../@types/request';
import { User } from '../@types/user';
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
  const session = req.session;
  if (!session) {
    return handleUnauthorizedResponse(res);
  }
  let identity: User | null = null;
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
