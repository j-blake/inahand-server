import { Schema, model, Document } from 'mongoose';
import { Profile } from '../@types/profile';
import { MongooseAccount } from './account';
import { MongooseCategory } from './category';

export interface MongooseProfile extends Profile, Document {
  id: string;
  accounts: MongooseAccount[];
  categories: MongooseCategory[];
}

const profileSchema = new Schema<MongooseProfile>(
  {
    accounts: ['Account'],
    categories: ['Category'],
  },
  {
    timestamps: true,
    toObject: { transform: transformToObject },
  }
);

function transformToObject(
  _: MongooseProfile,
  profile: MongooseProfile
): Profile {
  return {
    id: profile._id.toString(),
    accounts: profile.accounts,
    categories: profile.categories,
  };
}

export default model<MongooseProfile>('Profile', profileSchema);
