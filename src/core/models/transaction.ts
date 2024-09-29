import mongoose, { Schema } from 'mongoose';
import { TransactionAttributes } from '../interfaces/transaction';

const transactionSchema = new Schema<TransactionAttributes>({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    transaction_reference: {
      type: String,
      required: true
    },
    DateTime: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      default: null
    },
    sender: {
      type: String,
      default: null
    },
    receipient: {
      type: String,
      default: null
    },
    receipient_bank: {
      type: String,
      default: null
    },
    receipient_account: {
      type: String,
      default: null
    },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
