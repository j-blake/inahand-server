const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const categorySchema = Schema({
  name: {
    type: String,
    required: true,
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
});

categorySchema.pre('remove', function preRemove(next) {
  const CategoryModel = model('Category');
  /* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
  CategoryModel.find({ parent: this._id }).exec((err, categories) => {
    if (err !== null) {
      return console.error(err);
    }
    categories.forEach((category) => {
      try {
        category.remove();
      } catch (e) {
        console.error(e);
      }
    });
    return next();
  });
});

module.exports = model('Category', categorySchema);
