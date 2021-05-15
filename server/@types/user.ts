import { Profile } from './profile';

export interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
  passwordHash: string;
  profiles: Profile[];
  isActive: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}
