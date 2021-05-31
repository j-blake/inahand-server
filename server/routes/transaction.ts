import { Router } from 'express';
import transactionService from '../service/transaction';

const router = Router();

router.get('/transactions', (req, res) => transactionService.findAll(req, res));

router.get('/transaction/:id', (req, res) =>
  transactionService.findOne(req, res)
);

router.post('/transaction', (req, res) => transactionService.add(req, res));

router.patch('/transaction/:id', (req, res) =>
  transactionService.updateOne(req, res)
);

router.delete('/transaction/:id', (req, res) =>
  transactionService.deleteOne(req, res)
);

module.exports = router;
