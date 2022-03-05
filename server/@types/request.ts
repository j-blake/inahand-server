import { Request as ExpressRequest } from 'express';
import { Session } from './session';
import { User } from './user';

export interface Request extends ExpressRequest {
  identity: User;
  session: Session;
}
