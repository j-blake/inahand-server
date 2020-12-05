const express = require('express');
const account = require('../service/account');

const router = express.Router();

router.get('/accounts', (req, res) => {
  try {
    const { identity } = req;
    const profile = identity.profiles[0];
    return res.status(200).json({ accounts: profile.accounts });
  } catch (err) {
    return res.status(404).send();
  }
});

router.get('/account/:id', (req, res) => account.findOne(req, res));

router.post('/account', (req, res) => account.add(req, res));

router.patch('/account/:id', (req, res) => account.updateOne(req, res));

router.delete('/account/:id', (req, res) => account.deleteOne(req, res));

module.exports = router;
