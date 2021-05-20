const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    amount: {
      type: Schema.Types.Decimal128,
      required: true,
      validate: [
        (v) => v >= 0,
        'The amount {VALUE} is less than the minimum value of 0.00',
      ],
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
      type: [
        {
          amount: {
            type: Schema.Types.Decimal128,
            validate: [
              (v) => v >= 0,
              'The amount {VALUE} is less than the minimum value of 0.00',
            ],
          },
          category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
          },
        },
      ],
      validate: {
        validator: function detailsAmountValidator(value) {
          return (
            value.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0) <=
            this.amount
          );
        },
        message: () =>
          'The sum of details amount must be greater than 0 and less than the transaction amount.',
      },
    },
    payerAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    payeeAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.statics.findByName = function findByName(
  transactionName,
  callback
) {
  return this.find({ description: transactionName.toUpperCase() }, callback);
};

module.exports =
  mongoose.models.Transaction || model('Transaction', transactionSchema);
