import { Schema, model, Types } from 'mongoose';

export interface TransactionDetail extends Types.EmbeddedDocument {
  amount: number;
  category: Types.ObjectId;
}

export const transactionDetailSchema = new Schema<TransactionDetail>({
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
});

export default model<TransactionDetail>(
  'TransactionDetail',
  transactionDetailSchema
);
