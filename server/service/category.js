const Category = require('../model/category');

exports.findAll = async (req, res) => {
  try {
    const { identity } = req;
    const profile = identity.profiles[0];
    const jsonCategories = await Category
      .find({ profile: profile.id })
      .then(categories => categories.map(category => category.toObject()));
    return res.status(200).json({ categories: jsonCategories });
  } catch (err) {
    return res.status(404).send();
  }
};

exports.create = async (req, res) => {
  const profile = req.identity.profiles[0];
  const category = new Category({ ...req.body, profile: profile.id });
  try {
    await category.save();
    return res.status(201).json({ category: category.toObject() });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
};

exports.delete = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).exec();
    if (category === null) {
      return res.status(404).send();
    }
    await category.remove();
    return res.status(204).send();
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
};
