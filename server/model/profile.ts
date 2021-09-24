import {
  Schema,
  model,
  SchemaDefinition,
  DocumentDefinition,
  Types,
} from 'mongoose';
import { Profile } from '../@types/profile';
import { accountSchema, MongooseAccount } from './account';
import { categorySchema, MongooseCategory } from './category';

export interface MongooseProfile {
  _id: Types.ObjectId;
  accounts: Types.DocumentArray<MongooseAccount>;
  categories: Types.DocumentArray<MongooseCategory>;
  createdAt: Date;
  updatedAt: Date;
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

function transformToObject(doc: MongooseProfile): Profile {
  return {
    id: doc._id.toString(),
    accounts: doc.accounts.toObject(),
    categories: doc.categories.toObject(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export default model<MongooseProfile>('Profile', profileSchema);
