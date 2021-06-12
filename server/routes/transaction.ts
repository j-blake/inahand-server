import { Router } from 'express';
import transactionService from '../service/transaction';

const router = Router();

router.get('/transactions', async (_, res) => {
  const transactions = await transactionService.findAll();
  res.status(200).json({ transactions });
});

// router.get('/transaction/:id', (req, res) =>
//   transactionService.findOne(req, res)
// );

router.post('/transaction', async (req, res) => {
  try {
    const transaction = await transactionService.add(req.body);
    return res.status(201).json({ transaction });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
});

// router.patch('/transaction/:id', (req, res) =>
//   transactionService.updateOne(req, res)
// );

// router.delete('/transaction/:id', (req, res) =>
//   transactionService.deleteOne(req, res)
// );

export default router;
