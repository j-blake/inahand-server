import { Router } from 'express';
import {
  findAccountTransactionsByProfile,
  findTransactionByProfile,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../service/transaction';
import { Request } from '../@types/request';

const router = Router();

router.get('/transactions/:accountId', async (req, res) => {
  const { identity } = req as Request;
  const profile = identity.profiles[0];
  try {
    const transactions = await findAccountTransactionsByProfile(
      profile,
      req.params.accountId
    );
    res.status(200).json({ transactions });
  } catch (e) {
    res.status(400).json((e as Error).toString());
  }
});

router.get('/transaction/:transactionId', async (req, res) => {
  const { identity } = req as Request;
  const profile = identity.profiles[0];
  try {
    const transaction = await findTransactionByProfile(
      req.params.transactionId,
      profile
    );
    res.status(200).json({ transaction });
  } catch (e) {
    res.status(400).json((e as Error).toString());
  }
});

router.post('/transaction', async (req, res) => {
  const { body, identity } = req as Request;
  try {
    const transaction = await createTransaction(body, identity.profiles[0]);
    return res.status(201).json({ transaction });
  } catch (err) {
    const { message } = err as Error;
    return res.status(400).json({ message });
  }
});

router.patch('/transaction/:id', async (req, res) => {
  const { body, identity } = req as Request;
  try {
    const transaction = await updateTransaction(
      req.params.id,
      body,
      identity.profiles[0]
    );
    return res.status(200).json({ transaction });
  } catch (err) {
    const { message } = err as Error;
    return res.status(400).json({ message });
  }
});

router.delete('/transaction/:id', async (req, res) => {
  try {
    const { identity } = req as Request;
    const profile = identity.profiles[0];
    const transaction = await deleteTransaction(req.params.id, profile);
    return res.status(204).json({ transaction });
  } catch (err) {
    const { message } = err as Error;
    return res.status(400).json({ message });
  }
});

export default router;
