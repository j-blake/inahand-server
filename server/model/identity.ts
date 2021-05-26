import mongoose, {
  Schema,
  model,
  Document,
  ValidatorProps,
  SchemaDefinition,
  DocumentDefinition,
} from 'mongoose';
import validator from 'validator';
import { User } from '../@types/user';
import { MongooseProfile } from './profile';

export interface MongooseIdentity extends User, Document {
  id: string;
  profiles: MongooseProfile[];
  createdAt: Date;
  updatedAt: Date;
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
  } as SchemaDefinition<DocumentDefinition<MongooseIdentity>>,
  {
    timestamps: true,
    toObject: { transform: transformToObject },
  }
);

function transformToObject(_: MongooseIdentity, user: MongooseIdentity): User {
  user.id = user._id.toString();
  return user;
}
const IdentityModel = model<MongooseIdentity>('Identity', identitySchema);

export default IdentityModel;
