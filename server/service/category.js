const Category = require('../model/category');

class CategoryService {
  static async findAll(req, res) {
    try {
      const categories = await Category.find();
      return res.status(200).json({ categories });
    } catch (err) {
      return res.status(404).send();
    }
  }

  static async findOne(req, res) {
    try {
      const category = await Category.findById(req.params.id).exec();
      if (category === null) {
        return res.status(404).send();
      }
      return res.status(200).json({ category });
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }

  static async add(req, res) {
    const category = new Category(req.body);
    try {
      await category.save();
      return res.status(201).json({ category });
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }

  static async updateOne(req, res) {
    try {
      const category = await Category.findById(req.params.id).exec();
      if (category === null) {
        return res.status(404).send();
      }
      const {
        name = category.name,
        parent = category.parent,
        isActive = category.isActive,
      } = req.body;
      category.name = name || category.name;
      category.parent = parent || category.parent;
      category.isActive = Boolean(isActive);
      category.dateUpdated = Date.now();
      await category.save();
      return res.status(200).json({ category });
    } catch (err) {
      const { message } = err;
      return res.status(400).json({ message });
    }
  }

  static async cascadeDelete(req, res) {
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
  }
}

module.exports = CategoryService;
