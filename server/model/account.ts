import { Schema, model, Types, HydratedDocument } from 'mongoose';
import { Account } from '../@types/account';

type MongooseAccount = Account & Types.Subdocument;

export const accountSchema = new Schema<MongooseAccount>(
  {
    name: {
      type: String,
      required: true,
    },
    initialBalance: { type: Number, required: true },
    currentBalance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toObject: { transform: transformToObject },
  }
);

function transformToObject(
  account: HydratedDocument<MongooseAccount>
): Account {
  return {
    id: account._id.toString(),
    name: account.name,
    initialBalance: account.initialBalance,
    currentBalance: account.currentBalance,
    currency: account.currency,
    isActive: account.isActive,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export default model<MongooseAccount>('Account', accountSchema);
