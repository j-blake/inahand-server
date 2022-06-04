import {
  Schema,
  model,
  Types,
  PreMiddlewareFunction,
  SchemaDefinition,
  DocumentDefinition,
  HydratedDocument,
} from 'mongoose';
import { Category } from '../@types/category';
import { MongooseProfile } from './profile';

type MongooseCategory = Category & Types.Subdocument;

export const categorySchema = new Schema<MongooseCategory>(
  {
    name: {
      type: String,
      required: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      sparse: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Identity',
      sparse: true,
    },
    isActive: { type: Boolean, default: true },
  } as SchemaDefinition<DocumentDefinition<MongooseCategory>>,
  {
    timestamps: true,
    toObject: { transform: transformToObject },
  }
);

const preRemove: PreMiddlewareFunction<MongooseCategory> =
  async function preRemove(this: MongooseCategory, next): Promise<void> {
    const profile = this.parent() as HydratedDocument<MongooseProfile>;
    const id = this._id;
    const categories = profile.categories.filter(
      (category) => category.parentCategory?.toString() === id.toString()
    );
    categories.forEach((category) => {
      category.remove();
    });
    return next();
  };
categorySchema.pre<MongooseCategory>('remove', preRemove);

function transformToObject(doc: HydratedDocument<MongooseCategory>): Category {
  return {
    id: doc._id.toString(),
    name: doc.name,
    parentCategory: doc.parentCategory?.toString() ?? null,
    createdBy: doc.createdBy.toString(),
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export default model<MongooseCategory>('Category', categorySchema);
