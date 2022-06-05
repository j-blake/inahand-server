import {
  Schema,
  Types,
  model,
  SchemaDefinition,
  DocumentDefinition,
  HydratedDocument,
} from 'mongoose';
import { Account } from '../@types/account';
import { Category } from '../@types/category';
import { Profile } from '../@types/profile';
import { accountSchema } from './account';
import { categorySchema } from './category';

export interface MongooseProfile extends Profile {
  accounts: Types.DocumentArray<Account>;
  categories: Types.DocumentArray<Category>;
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

function transformToObject(doc: HydratedDocument<MongooseProfile>): Profile {
  return {
    id: doc._id.toString(),
    accounts: doc.accounts.map((a) => a.toObject()),
    categories: doc.categories.map((c) => c.toObject()),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export default model<MongooseProfile>('Profile', profileSchema);
