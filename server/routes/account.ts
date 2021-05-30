import express from 'express';
import { Request as IdentityRequest } from '../@types/request';
import * as service from '../service/account';

const router = express.Router();

router.get('/accounts', async (req, res) => {
  try {
    const { identity } = req as IdentityRequest;
    const accounts = await service.findAll(identity);
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
    } = req as IdentityRequest;
    const account = await service.create(identity, data);
    return res.status(201).json({ account });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
});

router.patch('/account/:id', async (req, res) => {
  try {
    const { identity } = req as IdentityRequest;
    const account = await service.findAccount(identity, req.params.id);
    if (!account) {
      return res.status(404).send();
    }
    const updatedAccount = await service.update(identity, account, req.body);
    if (updatedAccount === null) {
      throw new Error('Unable to update account');
    }
    return res.status(200).json({ account: updatedAccount });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
});

export default router;
