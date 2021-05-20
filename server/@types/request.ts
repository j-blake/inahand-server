import { Request as ExpressRequest } from 'express';
import { User } from './user';

export interface Request extends ExpressRequest {
  identity: User;
}
