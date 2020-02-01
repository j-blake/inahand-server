const express = require('express');

const router = express.Router();
const account = require('../service/account');

router.get('/accounts', (req, res) => account.findAll(req, res));

router.get('/account/:id', (req, res) => account.findOne(req, res));

router.post('/account', (req, res) => account.add(req, res));

router.patch('/account/:id', (req, res) => account.updateOne(req, res));

router.delete('/account/:id', (req, res) => account.deleteOne(req, res));

module.exports = router;
