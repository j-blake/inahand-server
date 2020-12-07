const express = require('express');
const accountService = require('../service/account');

const router = express.Router();

router.get('/accounts', async (req, res) => {
  try {
    const { identity } = req;
    const accounts = await accountService.findAll(identity);
    return res.status(200).json({ accounts });
  } catch (err) {
    return res.status(404).send();
  }
});

router.post('/account', (req, res) => accountService.add(req, res));

router.patch('/account/:id', (req, res) => accountService.updateOne(req, res));

module.exports = router;
