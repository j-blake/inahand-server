import { ObjectId } from 'bson';
import { Schema, model, Document } from 'mongoose';
import { Account } from '../@types/account';

export interface MongooseAccount extends Account, Document {
  _id: ObjectId;
}

const accountSchema = new Schema<MongooseAccount>(
  {
    name: {
      type: String,
      required: true,
    },
    initialBalance: { type: Number, required: true },
    currentBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default model('Account', accountSchema);
