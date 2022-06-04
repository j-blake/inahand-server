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

const identitySchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: true,
      validate: nameValidator,
    },
    lastName: {
      type: String,
      required: true,
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
  } as SchemaDefinition<DocumentDefinition<User>>,
  {
    timestamps: true,
    toObject: { transform: transformToObject },
  }
);

function transformToObject(
  doc: Document<string, never, User>,
  ret: User
): User {
  return {
    id: doc._id ?? '',
    firstName: ret.firstName,
    lastName: ret.lastName,
    email: ret.email,
    profiles: ret.profiles,
    isActive: ret.isActive,
    passwordHash: ret.passwordHash,
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  };
}
const IdentityModel = model<User>('Identity', identitySchema);

export default IdentityModel;
