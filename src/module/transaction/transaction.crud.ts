import { Transaction, ITransaction, TransactionStatus } from './transaction.model';
import { AppError } from '../../utils/helpers';
import mongoose from 'mongoose';

export const transactionCrud = {
  async create(data: Partial<ITransaction>): Promise<ITransaction> {
    try {
      // Initialize status history with the initial status
      const transactionData = {
        ...data,
        statusHistory: [{
          status: data.status || TransactionStatus.PENDING_PAYMENT,
          timestamp: new Date(),
          note: 'Transaction created'
        }]
      };

      const transaction = await Transaction.create(transactionData);
      return transaction;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new AppError('Invalid transaction data', 400);
      }
      throw error;
    }
  },

  async findById(id: string): Promise<ITransaction | null> {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    return transaction;
  },

  async findByUserId(userId: string, page = 1, limit = 10): Promise<{ transactions: ITransaction[]; total: number }> {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments({ userId })
    ]);
    return { transactions, total };
  },

  async updateStatus(id: string, status: TransactionStatus, note?: string): Promise<ITransaction> {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    transaction.status = status;
    transaction.statusHistory.push({
      status,
      timestamp: new Date(),
      note
    });

    await transaction.save();
    return transaction;
  },

  async uploadPaymentProof(id: string, proofUrl: string): Promise<ITransaction> {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    transaction.paymentProof = proofUrl;
    await transaction.save();
    return transaction;
  },

  async findAll(query: {
    status?: TransactionStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ transactions: ITransaction[]; total: number }> {
    const { status, startDate, endDate, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter)
    ]);

    return { transactions, total };
  },

  async delete(id: string): Promise<void> {
    const result = await Transaction.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new AppError('Transaction not found', 404);
    }
  }
};
