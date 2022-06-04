import mongoose, {
  Schema,
  model,
  ValidatorProps,
  SchemaDefinition,
  DocumentDefinition,
  HydratedDocument,
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

function transformToObject(doc: HydratedDocument<User>): User {
  return {
    id: doc._id?.toString() ?? '',
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    profiles: doc.profiles,
    isActive: doc.isActive,
    passwordHash: doc.passwordHash,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
const IdentityModel = model<User>('Identity', identitySchema);

export default IdentityModel;
