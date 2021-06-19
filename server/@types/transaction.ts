export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  transactionType: 'debit' | 'credit';
  description: string;
  transactionDate: Date;
  details?: { category: string; amount: number }[];
  payerAccount: string;
  payeeAccount: string;
  createdAt: Date;
  updatedAt: Date;
}
