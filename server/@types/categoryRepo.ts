import { Category } from './category';
import { Profile } from './profile';

export interface CategoryRepository {
  findByProfile: (profile: Profile) => Promise<Category[]>;
}
