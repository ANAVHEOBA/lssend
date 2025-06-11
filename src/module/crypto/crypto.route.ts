import { Router } from 'express';
import { cryptoController } from './crypto.controller';

const router = Router();

// Get current price
router.get('/price', cryptoController.getCurrentPrice);

// Get historical prices
router.get('/history', cryptoController.getHistoricalPrices);

// Get top cryptos
router.get('/top', cryptoController.getTopCryptos);

export const cryptoRoutes = router; 