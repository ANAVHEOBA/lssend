import Joi from 'joi';
import { PaymentMethod, TransactionStatus, TransactionType } from './transaction.model';

export const createBuyTransactionSchema = Joi.object({
  liskAmount: Joi.number()
    .required()
    .min(1)
    .max(10000) // Maximum 10,000 LSK per transaction
    .messages({
      'number.base': 'Lisk amount must be a number',
      'number.min': 'Lisk amount must be at least 1',
      'number.max': 'Lisk amount cannot exceed 10,000',
      'any.required': 'Lisk amount is required'
    }),
  liskAddress: Joi.string()
    .required()
    .pattern(/^lsk[a-zA-Z0-9]{38}$/)
    .messages({
      'string.pattern.base': 'Invalid Lisk address format. Must start with "lsk" and be 41 characters long',
      'any.required': 'Lisk address is required'
    }),
  paymentMethod: Joi.string()
    .valid(PaymentMethod.BANK_TRANSFER)
    .default(PaymentMethod.BANK_TRANSFER)
    .messages({
      'any.only': 'Invalid payment method'
    })
});

export const createSellTransactionSchema = Joi.object({
  liskAmount: Joi.number()
    .required()
    .min(1)
    .max(10000) // Maximum 10,000 LSK per transaction
    .messages({
      'number.base': 'Lisk amount must be a number',
      'number.min': 'Lisk amount must be at least 1',
      'number.max': 'Lisk amount cannot exceed 10,000',
      'any.required': 'Lisk amount is required'
    }),
  bankDetails: Joi.object({
    accountName: Joi.string()
      .required()
      .min(3)
      .max(100)
      .messages({
        'string.min': 'Account name must be at least 3 characters long',
        'string.max': 'Account name cannot exceed 100 characters',
        'any.required': 'Account name is required'
      }),
    accountNumber: Joi.string()
      .required()
      .pattern(/^[0-9]{10}$/)
      .messages({
        'string.pattern.base': 'Account number must be 10 digits',
        'any.required': 'Account number is required'
      }),
    bankName: Joi.string()
      .required()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Bank name must be at least 2 characters long',
        'string.max': 'Bank name cannot exceed 50 characters',
        'any.required': 'Bank name is required'
      }),
    branchCode: Joi.string()
      .optional()
      .allow(''),
    swiftCode: Joi.string()
      .optional()
      .allow('')
  })
    .required()
    .messages({
      'any.required': 'Bank details are required'
    })
});

export const updateTransactionStatusSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid(...Object.values(TransactionStatus))
    .messages({
      'any.only': 'Invalid status',
      'any.required': 'Status is required'
    }),
  note: Joi.string()
    .max(500)
    .messages({
      'string.max': 'Note cannot exceed 500 characters'
    })
});

export const uploadPaymentProofSchema = Joi.object({});

export const uploadSellProofSchema = Joi.object({
  sellProof: Joi.string().required().messages({
    'any.required': 'Transaction hash proof is required'
  })
});

export const getTransactionsSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TransactionStatus)),
  type: Joi.string()
    .valid(...Object.values(TransactionType)),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref('startDate')),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10)
}); 