import {
  Schema,
  model,
  Types,
  SchemaDefinition,
  DocumentDefinition,
} from 'mongoose';
import { transactionDetailSchema } from './transactionDetails';

export interface TransactionDetail extends Types.EmbeddedDocument {
  amount: number;
  category: Types.ObjectId;
}

interface MongooseTransaction {
  _id: Types.ObjectId;
  id: string;
  amount: number;
  currency: string;
  transactionType: 'debit' | 'credit';
  description: string;
  transactionDate: Date;
  payingAccount: Types.ObjectId;
  receivingAccount: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<MongooseTransaction>(
  {
    amount: {
      type: Schema.Types.Number,
      required: true,
      validate: [
        (v: number) => v >= 0,
        'The amount {VALUE} is less than the minimum value of 0.00',
      ],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    transactionType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
    details: [transactionDetailSchema],
    payerAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    payeeAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  } as SchemaDefinition<DocumentDefinition<MongooseTransaction>>,
  {
    timestamps: true,
  }
);

export default model<MongooseTransaction>('Transaction', transactionSchema);
