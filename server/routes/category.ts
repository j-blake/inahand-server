import express from 'express';
import { Request } from '../@types/request';
import * as categoryService from '../service/category';

const router = express.Router();

router.get('/categories', async (req, res) => {
  try {
    const { identity } = req as Request;
    const profile = identity.profiles[0];
    const jsonCategories = await categoryService.findAll(profile);
    return res.status(200).json({ categories: jsonCategories });
  } catch (err) {
    return res.status(404).send();
  }
});

router.post('/category', async (req, res) => {
  const profile = (req as Request).identity.profiles[0];
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
    const category = await categoryService.deleteCategory(req.params.id);
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
