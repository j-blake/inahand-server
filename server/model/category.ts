import { ObjectId } from 'bson';
import {
  Schema,
  model,
  Types,
  PreMiddlewareFunction,
  SchemaDefinition,
  DocumentDefinition,
} from 'mongoose';
import { Category } from '../@types/category';

export interface MongooseCategory extends Category, Types.EmbeddedDocument {
  id: string;
  _id: ObjectId;
}

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
    isActive: { type: Boolean, default: true },
  } as SchemaDefinition<DocumentDefinition<MongooseCategory>>,
  {
    timestamps: true,
    toObject: { transform: transformToObject },
  }
);

const preRemove: PreMiddlewareFunction<MongooseCategory> = async function preRremove(
  this: MongooseCategory,
  next
): Promise<void> {
  const Category = model<MongooseCategory>('Category');
  const categories = await Category.find({ parentCategory: this._id }).exec();
  categories.forEach((category) => {
    category.remove();
  });
  return next();
};
categorySchema.pre<MongooseCategory>('remove', preRemove);

function transformToObject(doc: MongooseCategory) {
  return {
    id: doc._id,
    name: doc.name,
    parent: doc.parent,
  };
}

export default model('Category', categorySchema);
