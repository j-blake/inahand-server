import {
  Schema,
  model,
  Document,
  SchemaDefinition,
  DocumentDefinition,
  Types,
} from 'mongoose';
import { Profile } from '../@types/profile';
import { accountSchema, MongooseAccount } from './account';
import { categorySchema, MongooseCategory } from './category';

export interface MongooseProfile extends Profile, Document {
  id: string;
  accounts: Types.DocumentArray<MongooseAccount>;
  categories: Types.DocumentArray<MongooseCategory>;
}

const profileSchema = new Schema<MongooseProfile>(
  {
    accounts: [accountSchema],
    categories: [categorySchema],
  } as SchemaDefinition<DocumentDefinition<MongooseProfile>>,
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
