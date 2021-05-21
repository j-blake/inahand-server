import { Schema, model, Types, Document } from 'mongoose';
import { Profile } from '../@types/profile';

export interface MongooseProfile extends Profile, Document {
  id: string;
  _id: Types.ObjectId;
}

const profileSchema = new Schema<MongooseProfile>({
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      default: [],
    },
  ],
});

export default model('Profile', profileSchema);
