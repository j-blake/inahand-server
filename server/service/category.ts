import { Category } from '../@types/category';
import { Profile } from '../@types/profile';
import CategoryModel, { MongooseCategory } from '../model/category';

export const findAll = async (profile: Profile): Promise<Category[]> => {
  const categories = await CategoryModel.find({ profile });
  return (categories as MongooseCategory[]).map((category) =>
    category.toObject()
  );
};

export const create = async (
  profile: Profile,
  data: Category
): Promise<MongooseCategory> => {
  const category = new CategoryModel({ ...data, profile: profile.id });
  await category.save();
  return category;
};

export const deleteCategory = async (id: string): Promise<Category | null> => {
  const category = await CategoryModel.findById(id).exec();
  if (category === null) {
    return null;
  }
  await category.remove();
  return category;
};
