import { Category } from '../@types/category';
import { Profile } from '../@types/profile';
import { User } from '../@types/user';
import { getCategoryRepo } from '../repository';

export const findAll = async (
  profile: Profile,
  user: User
): Promise<Category[]> => {
  const repo = getCategoryRepo();
  const categories = await repo.findByProfileForUser(profile, user);
  return categories;
};

export const create = async (
  profile: Profile,
  data: Partial<Category>
): Promise<Category> => {
  const repo = getCategoryRepo();
  const category = await repo.createCategoryForProfile(profile, data);
  return category;
};

export const deleteCategory = async (
  profile: Profile,
  id: string
): Promise<Category | null> => {
  const repo = getCategoryRepo();
  const category = await repo.removeCategoryForProfile(profile, id);
  if (category === null) {
    return null;
  }
  return category;
};
