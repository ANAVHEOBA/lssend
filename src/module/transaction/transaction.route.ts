import { Router } from 'express';
import { transactionController } from './transaction.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { createBuyTransactionSchema, createSellTransactionSchema, updateTransactionStatusSchema, uploadPaymentProofSchema, uploadSellProofSchema, getTransactionsSchema } from './transaction.schema';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { upload } from '../../config/cloudinary.config';

const router = Router();

// Protect all routes
router.use(protect);

// User routes
router.post('/buy', validateRequest(createBuyTransactionSchema), transactionController.createBuyTransaction);
router.post('/sell', validateRequest(createSellTransactionSchema), transactionController.createSellTransaction);
router.get('/my-transactions', transactionController.getUserTransactions);
router.get('/:id', transactionController.getTransaction);

// Separate endpoints for payment proofs
router.post('/:id/payment-proof', upload.single('paymentProof'), transactionController.uploadPaymentProof); // For buy transactions
router.post('/:id/sell-proof', upload.single('sellProof'), transactionController.uploadSellProof); // For sell transactions

// Admin routes
router.use(restrictTo('admin'));
router.patch('/:id/status', validateRequest(updateTransactionStatusSchema), transactionController.updateTransactionStatus);
router.get('/', validateRequest(getTransactionsSchema), transactionController.getAllTransactions);

export const transactionRoutes = router;
