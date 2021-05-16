import { ObjectId } from 'bson';
import { Session as ExpressSession } from 'express-session';
import { UserAgent } from './userAgent';

export interface Session extends ExpressSession {
  identity: ObjectId;
  userAgent: UserAgent;
}
