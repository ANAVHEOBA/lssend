import mongoose, { Document, Schema } from 'mongoose';

export enum TransactionStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAYMENT_RECEIVED = 'payment_received',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CARD = 'card',
  CRYPTO = 'crypto'
}

export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell'
}

export interface IBankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchCode?: string;
  swiftCode?: string;
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  liskAmount: number;
  nairaAmount: number;
  liskAddress: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  bankDetails: IBankDetails;
  paymentReference: string;
  paymentDeadline: Date;
  paymentProof?: string;
  fees: {
    percentage: number;
    lsk: number;
    ngn: number;
    usd: number;
    eur: number;
    gbp: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true
    },
    liskAmount: {
      type: Number,
      required: true
    },
    nairaAmount: {
      type: Number,
      required: true
    },
    liskAddress: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING_PAYMENT
    },
    bankDetails: {
      accountName: {
        type: String,
        required: true
      },
      accountNumber: {
        type: String,
        required: true
      },
      bankName: {
        type: String,
        required: true
      },
      branchCode: String,
      swiftCode: String
    },
    paymentReference: {
      type: String,
      required: true,
      unique: true
    },
    paymentDeadline: {
      type: Date,
      required: true
    },
    paymentProof: {
      type: String
    },
    fees: {
      percentage: {
        type: Number,
        required: true
      },
      lsk: {
        type: Number,
        required: true
      },
      ngn: {
        type: Number,
        required: true
      },
      usd: {
        type: Number,
        required: true
      },
      eur: {
        type: Number,
        required: true
      },
      gbp: {
        type: Number,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ paymentReference: 1 }, { unique: true });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
