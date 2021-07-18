import {
  Schema,
  model,
  Types,
  SchemaDefinition,
  DocumentDefinition,
  Document,
} from 'mongoose';
import { Transaction } from '../@types/transaction';
import {
  transactionDetailSchema,
  MongooseTransactionDetail,
  TransactionDetail,
} from './transactionDetails';

export interface MongooseTransaction extends Document {
  _id: Types.ObjectId;
  id: string;
  amount: number;
  currency: string;
  transactionType: 'debit' | 'credit';
  description: string;
  transactionDate: Date;
  details?: MongooseTransactionDetail[];
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
        'The amount {VALUE} must be greater than zero',
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
    details: {
      type: [transactionDetailSchema],
      validate: [
        {
          validator: detailsAmountValidator,
          message: detailsAmountValidatorMessage,
        },
      ],
    },
    payingAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    receivingAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  } as SchemaDefinition<DocumentDefinition<MongooseTransaction>>,
  {
    timestamps: true,
    toObject: { transform: transformToObject },
  }
);

function detailsAmountValidator(
  this: Transaction,
  details: MongooseTransactionDetail[]
): boolean {
  return (
    details.length === 0 ||
    details
      .map((detail) => detail.amount)
      .reduce((acc, currentValue) => acc + currentValue, 0) === this.amount
  );
}

function detailsAmountValidatorMessage(
  this: Transaction,
  props: {
    path: string;
    value: TransactionDetail[];
  }
) {
  const detailsTotal = props.value
    .map((detail) => detail.amount)
    .reduce((acc, currentValue) => acc + currentValue, 0);
  return `The sum of details amounts, $${detailsTotal}, does not equal the total transaction amount`;
}

function transformToObject(doc: MongooseTransaction): Transaction {
  return {
    id: doc._id.toString(),
    amount: doc.amount,
    currency: doc.currency,
    description: doc.description,
    details: doc.details?.map(
      (detail) => (detail.toObject() as unknown) as TransactionDetail
    ),
    receivingAccount: doc.receivingAccount?.toString(),
    payingAccount: doc.payingAccount?.toString(),
    transactionDate: doc.transactionDate,
    transactionType: doc.transactionType,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export default model<MongooseTransaction>('Transaction', transactionSchema);
