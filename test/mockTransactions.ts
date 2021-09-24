import { Transaction } from '../server/@types/transaction';

export default (): Transaction[] => [
  {
    id: '1',
    amount: 102010,
    currency: 'USD',
    description: "Brucie's Fancy Shop",
    details: [
      {
        amount: 63240,
        category: '60cc864cee6f6f865bfa432d',
      },
      {
        amount: 11598,
        category: '60cc8661ee6f6f865bfa432f',
      },
      {
        amount: 27172,
        category: '60cc8668ee6f6f865bfa4331',
      },
    ],
    payingAccount: '5ea47ab0bfe5254ca4038bda',
    transactionDate: new Date('2021-06-21T00:00:00.000Z'),
    transactionType: 'debit',
    createdAt: new Date('2021-07-17T14:20:18.238Z'),
    updatedAt: new Date('2021-07-18T15:10:13.456Z'),
  },
  {
    id: '2',
    amount: 102010,
    currency: 'USD',
    description: "Brucie's Fancy Shop",
    details: [
      {
        amount: 63240,
        category: '60cc864cee6f6f865bfa432d',
      },
      {
        amount: 11598,
        category: '60cc8661ee6f6f865bfa432f',
      },
      {
        amount: 27172,
        category: '60cc8668ee6f6f865bfa43234',
      },
    ],
    payingAccount: '5ea47ab0bfe5254ca4038bda',
    transactionDate: new Date('2021-06-21T00:00:00.000Z'),
    transactionType: 'debit',
    createdAt: new Date('2021-07-17T14:20:18.238Z'),
    updatedAt: new Date('2021-07-18T15:10:13.456Z'),
  },
  {
    id: '3',
    amount: 102010,
    currency: 'USD',
    description: "Brucie's Fancy Shop",
    payingAccount: '5ea47ab0bfe5254ca4038bda',
    transactionDate: new Date('2021-06-21T00:00:00.000Z'),
    transactionType: 'debit',
    createdAt: new Date('2021-07-17T14:20:18.238Z'),
    updatedAt: new Date('2021-07-18T15:10:13.456Z'),
  },
];
