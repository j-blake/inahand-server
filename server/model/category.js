const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const categorySchema = Schema(
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

async function preRemove(next) {
  const Category = model('Category');
  const categories = await Category.find({ parent: this.id }).exec();
  categories.forEach((category) => {
    category.remove();
  });
  return next();
}
categorySchema.pre('remove', preRemove);

function transformToObject(doc) {
  return {
    id: doc.id,
    name: doc.name,
    parent: doc.parent,
  };
}
categorySchema.set('toObject', { transform: transformToObject });

module.exports = mongoose.models.Category || model('Category', categorySchema);
