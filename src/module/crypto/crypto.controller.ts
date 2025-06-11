import { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';
import { CryptoPrice } from './crypto.model';
import { AppError } from '../../utils/helpers';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequestWithRetry = async (url: string, params: any, retryCount = 0) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle rate limiting
      if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
        console.log(`Rate limited, retrying in ${RETRY_DELAY}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await sleep(RETRY_DELAY);
        return makeRequestWithRetry(url, params, retryCount + 1);
      }
      
      // Handle other API errors
      if (error.response?.status) {
        throw new AppError(`CoinGecko API error: ${error.response.status}`, error.response.status);
      }
    }
    throw error;
  }
};

export const cryptoController = {
  async getCurrentPrice(req: Request, res: Response, next: NextFunction): Promise<PriceResponse | void> {
    try {
      // Get LSK price in USD, EUR, GBP with retry
      const lskData = await makeRequestWithRetry(
        `${COINGECKO_API_URL}/simple/price`,
        {
          ids: 'lisk',
          vs_currencies: 'usd,eur,gbp',
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true
        }
      );

      // Get USDC price in NGN with retry
      const usdcData = await makeRequestWithRetry(
        `${COINGECKO_API_URL}/simple/price`,
        {
          ids: 'usd-coin',
          vs_currencies: 'ngn'
        }
      );

      const lsk = lskData.lisk;
      const usdToNgnRate = usdcData['usd-coin'].ngn;

      // Calculate LSK price in NGN
      const ngnPrice = lsk.usd * usdToNgnRate;

      // Store price data
      const priceData = {
        symbol: 'LSK',
        usd: lsk.usd,
        eur: lsk.eur,
        gbp: lsk.gbp,
        ngn: ngnPrice,
        usd_to_ngn_rate: usdToNgnRate,
        usd_market_cap: lsk.usd_market_cap,
        usd_24h_vol: lsk.usd_24h_vol,
        usd_24h_change: lsk.usd_24h_change
      };

      await CryptoPrice.create(priceData);

      const response: PriceResponse = {
        status: 'success',
        data: {
          prices: priceData
        }
      };

      // If this is a direct API call, send the response
      if (res && typeof res.json === 'function' && req.originalUrl.includes('/api/crypto/price')) {
        res.status(200).json(response);
        return;
      }

      // If called internally, return the response
      return response;
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      if (res && typeof res.json === 'function' && req.originalUrl.includes('/api/crypto/price')) {
        next(new AppError('Failed to fetch price data', 500));
      } else {
        throw new AppError('Failed to fetch price data', 500);
      }
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
      console.error('Error fetching historical prices:', error);
      next(new AppError('Failed to fetch historical prices', 500));
    }
  },

  async getTopCryptos(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) || 10;
      const page = Number(req.query.page) || 1;

      const data = await makeRequestWithRetry(
        `${COINGECKO_API_URL}/coins/markets`,
        {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: page,
          sparkline: false
        }
      );

      res.status(200).json({
        status: 'success',
        data: {
          cryptos: data
        }
      });
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      next(new AppError('Failed to fetch top cryptocurrencies', 500));
    }
  }
}; 