const express = require('express');

const router = express.Router();
const categoryService = require('../service/category');

router.get('/categories', (req, res) => categoryService.findAll(req, res));

router.get('/category/:id', (req, res) => categoryService.findOne(req, res));

router.post('/category', (req, res) => categoryService.add(req, res));

router.patch('/category/:id', (req, res) => categoryService.updateOne(req, res));

router.delete('/category/:id', (req, res) => categoryService.cascadeDelete(req, res));

module.exports = router;
