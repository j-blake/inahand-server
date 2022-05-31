import {
  Schema,
  model,
  Types,
  SchemaDefinition,
  DocumentDefinition,
} from 'mongoose';
import { MongooseCategory } from './category';

export interface TransactionDetail {
  id: string;
  amount: number;
  category: string;
}

export interface MongooseTransactionDetail extends Types.Subdocument {
  id: string;
  amount: number;
  category: MongooseCategory;
}

export const transactionDetailSchema = new Schema<MongooseTransactionDetail>(
  {
    amount: {
      type: Schema.Types.Number,
      validate: [
        (v: number) => v >= 0,
        'The amount {VALUE} is less than the minimum value of 0.00',
      ],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  } as SchemaDefinition<DocumentDefinition<MongooseTransactionDetail>>,
  {
    timestamps: true,
    toObject: { transform: transformToObject },
  }
);

function transformToObject(doc: MongooseTransactionDetail) {
  return {
    amount: doc.amount,
    category: doc.category,
  };
}

export default model<MongooseTransactionDetail>(
  'TransactionDetail',
  transactionDetailSchema
);
