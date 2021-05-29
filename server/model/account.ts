import { ObjectId } from 'bson';
import { Schema, model, Types } from 'mongoose';
import { Account } from '../@types/account';

export interface MongooseAccount extends Account, Types.EmbeddedDocument {
  id: string;
  _id: ObjectId;
}

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
  _: MongooseAccount,
  account: MongooseAccount
): Account {
  return {
    id: account._id.toString(),
    name: account.name,
    initialBalance: account.initialBalance,
    currentBalance: account.currentBalance,
    currency: account.currency,
    isActive: account.isActive,
    dateCreated: account.dateCreated,
    dateUpdated: account.dateUpdated,
  };
}
// todo [IN-4] transform to object
export default model<MongooseAccount>('Account', accountSchema);
