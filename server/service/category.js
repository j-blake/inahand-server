const Category = require('../model/category').default;

exports.findAll = async (profile) => {
  const categories = await Category.find({ profile });
  return categories.map((category) => category.toObject());
};

exports.create = async (profile, data) => {
  const category = new Category({ ...data, profile: profile.id });
  await category.save();
  return category;
};

exports.delete = async (id) => {
  const category = await Category.findById(id).exec();
  if (category === null) {
    return null;
  }
  await category.remove();
  return category;
};
