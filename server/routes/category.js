const express = require('express');
const categoryService = require('../service/category');

const router = express.Router();

router.get('/categories', async (req, res) => {
  try {
    const { identity } = req;
    const profile = identity.profiles[0];
    const jsonCategories = await categoryService.findAll(profile);
    return res.status(200).json({ categories: jsonCategories });
  } catch (err) {
    return res.status(404).send();
  }
});

router.post('/category', async (req, res) => {
  const profile = req.identity.profiles[0];
  try {
    const category = await categoryService.create(profile, req.body);
    return res.status(201).json({ category: category.toObject() });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
});

router.delete('/category/:id', async (req, res) => {
  try {
    const category = await categoryService.delete(req.params.id);
    if (category === null) {
      return res.status(404).send();
    }
    return res.status(204).send();
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
});

module.exports = router;
