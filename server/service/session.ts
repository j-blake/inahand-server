import { Session } from '../@types/session';
import { User } from '../@types/user';
import * as userService from './user';

export const saveSession = (session: Session): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    session.save((err) => {
      if (err) {
        // log error
        reject(err);
      }
      resolve();
    });
  });
};

export const destroySession = (session: Session): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    session.destroy((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

export const isValidSession = async (session: Session): Promise<User> =>
  userService.findById(session.identity);
