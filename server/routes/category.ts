import { Router } from 'express';
import { Category } from '../@types/category';
import { Request } from '../@types/request';
import * as categoryService from '../service/category';

const router = Router();

router.get('/categories', async (req, res) => {
  try {
    const { identity } = req as Request;
    const profile = identity.profiles[0];
    const jsonCategories = await categoryService.findAll(profile, identity);
    return res.status(200).json({ categories: jsonCategories });
  } catch (err) {
    return res.status(404).send();
  }
});

router.post('/category', async (req, res) => {
  const { identity, body } = req as Request;
  const profile = identity.profiles[0];
  const data: Partial<Category> = { ...body, createdBy: identity.id };
  try {
    const category = await categoryService.create(profile, data);
    return res.status(201).json({ category });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
});

router.delete('/category/:id', async (req, res) => {
  try {
    const { identity } = req as Request;
    const profile = identity.profiles[0];
    const category = await categoryService.deleteCategory(
      profile,
      req.params.id
    );
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
