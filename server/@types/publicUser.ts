import { Profile } from './profile';

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profiles: Profile[];
}
