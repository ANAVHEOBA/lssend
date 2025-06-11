import mongoose, { Document, Schema } from 'mongoose';

export interface ICryptoPrice extends Document {
  symbol: string;
  usd: number;
  eur: number;
  gbp: number;
  ngn: number;
  usd_to_ngn_rate: number;
  usd_market_cap?: number;
  usd_24h_vol?: number;
  usd_24h_change?: number;
  timestamp: Date;
}

const cryptoPriceSchema = new Schema<ICryptoPrice>(
  {
    symbol: {
      type: String,
      required: true,
      index: true,
    },
    usd: {
      type: Number,
      required: true,
    },
    eur: {
      type: Number,
      required: true,
    },
    gbp: {
      type: Number,
      required: true,
    },
    ngn: {
      type: Number,
      required: true,
    },
    usd_to_ngn_rate: {
      type: Number,
      required: true,
    },
    usd_market_cap: {
      type: Number,
    },
    usd_24h_vol: {
      type: Number,
    },
    usd_24h_change: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
cryptoPriceSchema.index({ symbol: 1, timestamp: -1 });

export const CryptoPrice = mongoose.model<ICryptoPrice>('CryptoPrice', cryptoPriceSchema); 