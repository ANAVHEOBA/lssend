import { Request, Response, NextFunction } from 'express';
import { transactionCrud } from './transaction.crud';
import { AppError } from '../../utils/helpers';
import { TransactionStatus, PaymentMethod, TransactionType } from './transaction.model';
import { cryptoController } from '../crypto/crypto.controller';

const TRANSACTION_FEE_PERCENTAGE = 1.5; // 1.5% transaction fee

export const transactionController = {
  async createBuyTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { liskAmount, liskAddress } = req.body;
      const userId = req.user.id;

      // Get current LSK price
      const priceResponse = await cryptoController.getCurrentPrice(req, res, next);
      if (!priceResponse?.data?.prices) {
        throw new AppError('Failed to get current LSK price', 500);
      }
      const prices = priceResponse.data.prices;

      // Calculate amounts in different currencies
      const amounts = {
        lsk: liskAmount,
        ngn: liskAmount * prices.ngn,
        usd: liskAmount * prices.usd,
        eur: liskAmount * prices.eur,
        gbp: liskAmount * prices.gbp
      };

      // Calculate transaction fee (1.5%)
      const fees = {
        lsk: (liskAmount * TRANSACTION_FEE_PERCENTAGE) / 100,
        ngn: (amounts.ngn * TRANSACTION_FEE_PERCENTAGE) / 100,
        usd: (amounts.usd * TRANSACTION_FEE_PERCENTAGE) / 100,
        eur: (amounts.eur * TRANSACTION_FEE_PERCENTAGE) / 100,
        gbp: (amounts.gbp * TRANSACTION_FEE_PERCENTAGE) / 100
      };

      // Calculate total amounts including fees
      const totals = {
        lsk: amounts.lsk + fees.lsk,
        ngn: amounts.ngn + fees.ngn,
        usd: amounts.usd + fees.usd,
        eur: amounts.eur + fees.eur,
        gbp: amounts.gbp + fees.gbp
      };

      // Create transaction
      const transaction = await transactionCrud.create({
        userId,
        liskAmount: totals.lsk, // Store total amount including fees
        nairaAmount: totals.ngn, // Store total amount including fees
        liskAddress,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        status: TransactionStatus.PENDING_PAYMENT,
        bankDetails: {
          accountName: process.env.BANK_ACCOUNT_NAME || 'Lisk Exchange',
          accountNumber: process.env.BANK_ACCOUNT_NUMBER || '0123456789',
          bankName: process.env.BANK_NAME || 'Access Bank'
        },
        paymentReference: `LSK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        fees: {
          percentage: TRANSACTION_FEE_PERCENTAGE,
          lsk: fees.lsk,
          ngn: fees.ngn,
          usd: fees.usd,
          eur: fees.eur,
          gbp: fees.gbp
        }
      });

      // Send response
      res.status(201).json({
        status: 'success',
        data: {
          transaction: {
            id: transaction._id,
            status: transaction.status,
            paymentReference: transaction.paymentReference,
            paymentDeadline: transaction.paymentDeadline
          },
          amounts: {
            base: {
              lsk: amounts.lsk,
              ngn: amounts.ngn,
              usd: amounts.usd,
              eur: amounts.eur,
              gbp: amounts.gbp
            },
            fees: {
              percentage: TRANSACTION_FEE_PERCENTAGE,
              lsk: fees.lsk,
              ngn: fees.ngn,
              usd: fees.usd,
              eur: fees.eur,
              gbp: fees.gbp
            },
            total: {
              lsk: totals.lsk,
              ngn: totals.ngn,
              usd: totals.usd,
              eur: totals.eur,
              gbp: totals.gbp
            }
          },
          currentRates: {
            usd: prices.usd,
            eur: prices.eur,
            gbp: prices.gbp,
            ngn: prices.ngn,
            usd_to_ngn_rate: prices.usd_to_ngn_rate
          },
          paymentInstructions: {
            amount: totals.ngn,
            bankDetails: transaction.bankDetails,
            reference: transaction.paymentReference,
            deadline: transaction.paymentDeadline,
            instructions: [
              'Make payment to the bank account details below',
              'Use the payment reference provided',
              'Payment must be completed within 24 hours',
              'Keep your payment receipt for verification'
            ]
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createSellTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { liskAmount, bankDetails } = req.body;
      const userId = req.user.id;

      // Get current LSK price
      const priceResponse = await cryptoController.getCurrentPrice(req, res, next);
      if (!priceResponse?.data?.prices) {
        throw new AppError('Failed to get current LSK price', 500);
      }
      const prices = priceResponse.data.prices;

      // Calculate amounts in different currencies
      const amounts = {
        lsk: liskAmount,
        ngn: liskAmount * prices.ngn,
        usd: liskAmount * prices.usd,
        eur: liskAmount * prices.eur,
        gbp: liskAmount * prices.gbp
      };

      // Calculate transaction fee (1.5%)
      const fees = {
        lsk: (liskAmount * TRANSACTION_FEE_PERCENTAGE) / 100,
        ngn: (amounts.ngn * TRANSACTION_FEE_PERCENTAGE) / 100,
        usd: (amounts.usd * TRANSACTION_FEE_PERCENTAGE) / 100,
        eur: (amounts.eur * TRANSACTION_FEE_PERCENTAGE) / 100,
        gbp: (amounts.gbp * TRANSACTION_FEE_PERCENTAGE) / 100
      };

      // Calculate total amounts after deducting fees
      const totals = {
        lsk: amounts.lsk - fees.lsk,
        ngn: amounts.ngn - fees.ngn,
        usd: amounts.usd - fees.usd,
        eur: amounts.eur - fees.eur,
        gbp: amounts.gbp - fees.gbp
      };

      // Create transaction
      const transaction = await transactionCrud.create({
        userId,
        type: TransactionType.SELL,
        liskAmount: amounts.lsk, // Store original amount
        nairaAmount: totals.ngn, // Store amount after fees
        liskAddress: process.env.PLATFORM_LSK_ADDRESS || 'lskd8y4kxutncd97hwqfn7yz4bw7js2qgswqgswqg', // Platform's LSK address
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        status: TransactionStatus.PENDING_PAYMENT,
        bankDetails,
        paymentReference: `LSK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        fees: {
          percentage: TRANSACTION_FEE_PERCENTAGE,
          lsk: fees.lsk,
          ngn: fees.ngn,
          usd: fees.usd,
          eur: fees.eur,
          gbp: fees.gbp
        }
      });

      // Send response
      res.status(201).json({
        status: 'success',
        data: {
          transaction: {
            id: transaction._id,
            status: transaction.status,
            paymentReference: transaction.paymentReference,
            paymentDeadline: transaction.paymentDeadline
          },
          amounts: {
            base: {
              lsk: amounts.lsk,
              ngn: amounts.ngn,
              usd: amounts.usd,
              eur: amounts.eur,
              gbp: amounts.gbp
            },
            fees: {
              percentage: TRANSACTION_FEE_PERCENTAGE,
              lsk: fees.lsk,
              ngn: fees.ngn,
              usd: fees.usd,
              eur: fees.eur,
              gbp: fees.gbp
            },
            total: {
              lsk: totals.lsk,
              ngn: totals.ngn,
              usd: totals.usd,
              eur: totals.eur,
              gbp: totals.gbp
            }
          },
          currentRates: {
            usd: prices.usd,
            eur: prices.eur,
            gbp: prices.gbp,
            ngn: prices.ngn,
            usd_to_ngn_rate: prices.usd_to_ngn_rate
          },
          paymentInstructions: {
            amount: amounts.lsk, // Original amount to send
            lskAddress: transaction.liskAddress,
            reference: transaction.paymentReference,
            deadline: transaction.paymentDeadline,
            instructions: [
              'Send LSK to the address provided below',
              'Use the payment reference provided',
              'Payment must be completed within 24 hours',
              'Keep your transaction hash for verification',
              `Note: A fee of ${TRANSACTION_FEE_PERCENTAGE}% will be deducted from your payment`
            ]
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionCrud.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { transaction }
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const { transactions, total } = await transactionCrud.findByUserId(
        req.user.id,
        Number(page) || 1,
        Number(limit) || 10
      );

      res.status(200).json({
        status: 'success',
        data: {
          transactions,
          pagination: {
            total,
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            pages: Math.ceil(total / (Number(limit) || 10))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadPaymentProof(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const fileUrl = (req.file as any).path; // Cloudinary URL
      const transaction = await transactionCrud.uploadPaymentProof(req.params.id, fileUrl);
      
      res.status(200).json({
        status: 'success',
        data: { 
          transaction,
          paymentProof: {
            url: fileUrl,
            uploadedAt: new Date(),
            message: 'Thank you for uploading your payment receipt. Your payment will be verified and LSK will be sent to your address.',
            instructions: [
              'Your bank payment will be verified',
              'Once verified, we will send LSK to your address',
              'Please ensure the payment reference and amount are clearly visible in the receipt',
              'The receipt should show the bank account details you paid to'
            ]
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadSellProof(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const fileUrl = (req.file as any).path; // Cloudinary URL
      const transaction = await transactionCrud.uploadPaymentProof(req.params.id, fileUrl);
      
      // Verify this is a sell transaction
      if (transaction.type !== TransactionType.SELL) {
        throw new AppError('This endpoint is only for sell transactions', 400);
      }

      res.status(200).json({
        status: 'success',
        data: { 
          transaction,
          sellProof: {
            url: fileUrl,
            uploadedAt: new Date(),
            message: 'Thank you for uploading your LSK transaction hash. Your transfer will be verified and processed.',
            instructions: [
              'Your LSK transfer will be verified',
              'Once verified, we will process your bank transfer',
              'You will receive the amount in your bank account after verification',
              'Please ensure the transaction hash is clearly visible in the screenshot'
            ]
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateTransactionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, note } = req.body;
      const transaction = await transactionCrud.updateStatus(req.params.id, status, note);
      
      res.status(200).json({
        status: 'success',
        data: { transaction }
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, startDate, endDate, page, limit } = req.query;
      const { transactions, total } = await transactionCrud.findAll({
        status: status as TransactionStatus,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: Number(page) || 1,
        limit: Number(limit) || 10
      });

      res.status(200).json({
        status: 'success',
        data: {
          transactions,
          pagination: {
            total,
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            pages: Math.ceil(total / (Number(limit) || 10))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
