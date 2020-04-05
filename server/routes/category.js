const express = require('express');

const router = express.Router();
const categoryService = require('../service/category');

router.get('/categories', (req, res) => categoryService.findAll(req, res));

router.post('/category', (req, res) => categoryService.create(req, res));

router.delete('/category/:id', (req, res) => categoryService.delete(req, res));

module.exports = router;
