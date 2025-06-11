import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { CryptoPrice } from './crypto.model';
import { AppError } from '../../utils/helpers';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

interface PriceResponse {
  status: string;
  data: {
    prices: {
      symbol: string;
      usd: number;
      eur: number;
      gbp: number;
      ngn: number;
      usd_to_ngn_rate: number;
      usd_market_cap?: number;
      usd_24h_vol?: number;
      usd_24h_change?: number;
    };
  };
}

export const cryptoController = {
  async getCurrentPrice(req: Request, res: Response, next: NextFunction): Promise<PriceResponse> {
    try {
      // Get LSK price in USD, EUR, GBP
      const lskResponse = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'lisk',
            vs_currencies: 'usd,eur,gbp',
            include_market_cap: true,
            include_24hr_vol: true,
            include_24hr_change: true
          }
        }
      );

      // Get USDC price in NGN for exchange rate
      const usdcResponse = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'usd-coin',
            vs_currencies: 'ngn'
          }
        }
      );

      const lskData = lskResponse.data.lisk;
      const usdToNgnRate = usdcResponse.data['usd-coin'].ngn;

      // Calculate LSK price in NGN
      const ngnPrice = lskData.usd * usdToNgnRate;

      // Store price data
      const priceData = {
        symbol: 'LSK',
        usd: lskData.usd,
        eur: lskData.eur,
        gbp: lskData.gbp,
        ngn: ngnPrice,
        usd_to_ngn_rate: usdToNgnRate,
        usd_market_cap: lskData.usd_market_cap,
        usd_24h_vol: lskData.usd_24h_vol,
        usd_24h_change: lskData.usd_24h_change
      };

      await CryptoPrice.create(priceData);

      const response: PriceResponse = {
        status: 'success',
        data: {
          prices: priceData
        }
      };

      // Only send response if this is a direct API call
      if (req.originalUrl.includes('/api/crypto/price')) {
        res.status(200).json(response);
      }

      return response;
    } catch (error) {
      if (req.originalUrl.includes('/api/crypto/price')) {
        next(new AppError('Failed to fetch price data', 500));
      }
      throw error;
    }
  },

  async getHistoricalPrices(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) || 10;
      const prices = await CryptoPrice.find()
        .sort({ timestamp: -1 })
        .limit(limit);

      res.status(200).json({
        status: 'success',
        data: { prices }
      });
    } catch (error) {
      next(new AppError('Failed to fetch historical prices', 500));
    }
  }
}; 