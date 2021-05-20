import mongoose, {
  Schema,
  model,
  Document,
  ValidatorProps,
  Types,
} from 'mongoose';
import validator from 'validator';
import { User } from '../@types/user';

export interface MongooseIdentity extends User, Document {
  id: string;
  _id: Types.ObjectId;
}

const nameValidator = {
  // allow names containing apostrophes or dashes
  validator: (v: string) => /^[-'.a-zA-Z]{0,50}$/.test(v),
  message: () =>
    'Enter a first name containing letters, apostrophes, dashes, or periods',
};

const validateUniqueEmail = async (v: string) => {
  const identity = await mongoose
    .model('Identity')
    .findOne({ email: v })
    .exec();
  return identity === null;
};

const identitySchema = new Schema<MongooseIdentity>(
  {
    firstName: {
      type: String,
      validate: nameValidator,
    },
    lastName: {
      type: String,
      validate: nameValidator,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      validate: [
        {
          validator: (v: string) => validator.isEmail(v),
          message: (props: ValidatorProps) =>
            `${props.value} is not a valid email address`,
        },
        {
          validator: (v: string) => validateUniqueEmail(v),
          message: (props: ValidatorProps) => `${props.value} is not available`,
        },
      ],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profiles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

function transformToObject(doc: MongooseIdentity) {
  return {
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
  };
}
identitySchema.set('toObject', { transform: transformToObject });

export default model('Identity', identitySchema);
