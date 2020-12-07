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

router.post('/account', async (req, res) => {
  try {
    const {
      identity,
      body: { data },
    } = req;
    const account = await accountService.add(identity, data);
    return res.status(201).json({ account });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
});

router.patch('/account/:id', (req, res) => accountService.updateOne(req, res));

module.exports = router;
