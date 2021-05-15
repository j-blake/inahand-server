import { Profile } from './profile';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  profiles: Profile[];
  isActive: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}
