import { User } from './user';
import { Session } from './session';

declare module 'express-serve-static-core' {
  export interface Request {
    identity: User;
    session: Session;
  }
}
