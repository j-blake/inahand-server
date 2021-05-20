import { ObjectId } from 'bson';
import { Schema, model, Document, PreMiddlewareFunction } from 'mongoose';
import { Category } from '../@types/category';

export interface MongooseCategory extends Category, Document {
  _id: ObjectId;
}

const categorySchema = new Schema<MongooseCategory>(
  {
    name: {
      type: String,
      required: true,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      sparse: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const preRemove: PreMiddlewareFunction<MongooseCategory> = async function preRremove(
  this: MongooseCategory,
  next
): Promise<void> {
  const Category = model<MongooseCategory>('Category');
  const categories = await Category.find({
    parent: this.id,
  }).exec();
  categories.forEach((category) => {
    category.remove();
  });
  return next();
};
categorySchema.pre<MongooseCategory>('remove', preRemove);

function transformToObject(doc: MongooseCategory) {
  return {
    id: doc.id,
    name: doc.name,
    parent: doc.parent,
  };
}
categorySchema.set('toObject', { transform: transformToObject });

export default model('Category', categorySchema);
