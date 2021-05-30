import { Category } from '../../@types/category';
import { Profile } from '../../@types/profile';
import MongooseProfile from '../../model/profile';

export const findByProfile = async (profile: Profile): Promise<Category[]> => {
  const mongooseProfile = await MongooseProfile.findById(profile.id);
  const categories = mongooseProfile?.categories;
  return categories?.toObject();
};
