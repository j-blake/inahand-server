import { Category } from './category';
import { Profile } from './profile';
import { User } from './user';

export interface CategoryRepository {
  findByProfileForUser: (profile: Profile, user: User) => Promise<Category[]>;
  createCategoryForProfile: (
    profile: Profile,
    data: Partial<Category>
  ) => Promise<Category>;
  removeCategoryForProfile: (
    profile: Profile,
    id: string
  ) => Promise<Category | null>;
}
