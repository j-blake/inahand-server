import { Category } from '../../@types/category';
import { Profile } from '../../@types/profile';
import { User } from '../../@types/user';
import CategoryModel from '../../model/category';
import MongooseProfile from '../../model/profile';

export const findByProfileForUser = async (
  profile: Profile,
  user: User
): Promise<Category[]> => {
  return new Promise((resolve) => {
    return resolve(
      profile.categories.filter((category) => category.createdBy === user.id)
    );
  });
};

export const createCategoryForProfile = async (
  profile: Profile,
  data: Partial<Category>
): Promise<Category | null> => {
  const profileDocument = await MongooseProfile.findById(profile.id);
  if (profileDocument === null) {
    return null;
  }
  const categoryDocument = new CategoryModel(data);
  profileDocument.categories.push(categoryDocument);
  await profileDocument.save();
  return categoryDocument.toObject() as Category;
};

export const removeCategoryForProfile = async (
  profile: Profile,
  categoryId: string
): Promise<Category | null> => {
  const category = profile.categories.find(
    (category) => (category.id = categoryId)
  );
  if (!category) {
    return null;
  }
  const profileDocument = await MongooseProfile.findById(profile.id);
  const categoryDocument = profileDocument?.categories.id(categoryId);
  if (!(categoryDocument && profileDocument)) {
    return null;
  }
  await categoryDocument.remove();
  await profileDocument.save();
  return category;
};
