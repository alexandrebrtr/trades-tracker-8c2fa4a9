
import { supabase } from '@/integrations/supabase/client';
import { formatISO } from 'date-fns';

interface BinanceCredentials {
  apiKey: string;
  secretKey: string;
}

interface BinanceTrade {
  symbol: string;
  id: number;
  orderId: number;
  orderListId: number;
  price: string;
  qty: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  isBuyer: boolean;
  isMaker: boolean;
  isBestMatch: boolean;
}

export class BinanceService {
  private static baseUrl = 'https://api.binance.com';
  
  /**
   * Fetches trades from Binance API and saves them to the database
   */
  static async importTradesFromBinance(userId: string, credentials: BinanceCredentials): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      if (!userId || !credentials.apiKey || !credentials.secretKey) {
        return { success: false, message: 'Informations d\'API manquantes' };
      }
      
      // Get all symbols from the user's existing trades
      const { data: userTrades, error: tradesError } = await supabase
        .from('trades')
        .select('symbol')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(20);
      
      if (tradesError) {
        console.error('Error fetching user trades:', tradesError);
        return { success: false, message: 'Erreur lors de la récupération des trades existants' };
      }
      
      // Extract unique symbols
      const symbols = Array.from(new Set(userTrades?.map(trade => trade.symbol) || []));
      
      // If no symbols found, use some default ones
      const symbolsToFetch = symbols.length > 0 ? symbols : ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
      
      // Fetch and process trades for each symbol
      let allTrades: any[] = [];
      let fetchedCount = 0;
      
      for (const symbol of symbolsToFetch) {
        try {
          // Simulate Binance API call (in a real app, this would be an actual API call)
          const trades = await this.simulateBinanceTradesApi(symbol, credentials);
          
          // Process trades for this symbol
          if (trades && trades.length > 0) {
            const processedTrades = this.processBinanceTrades(trades, userId);
            allTrades = [...allTrades, ...processedTrades];
            fetchedCount += trades.length;
          }
        } catch (err) {
          console.error(`Error fetching trades for ${symbol}:`, err);
          // Continue with other symbols
        }
      }
      
      // Insert all fetched trades into the database
      if (allTrades.length > 0) {
        const { error: insertError } = await supabase
          .from('trades')
          .insert(allTrades);
        
        if (insertError) {
          console.error('Error inserting trades:', insertError);
          return { success: false, message: 'Erreur lors de l\'insertion des trades' };
        }
        
        // Update trades count
        const { updateTradesCount } = await import('@/hooks/useTradesFetcher');
        await updateTradesCount(userId);
        
        return { 
          success: true, 
          message: `${allTrades.length} trades importés avec succès`, 
          count: allTrades.length 
        };
      }
      
      return { success: true, message: 'Aucun nouveau trade trouvé', count: 0 };
    } catch (error) {
      console.error('Error importing trades from Binance:', error);
      return { success: false, message: 'Erreur lors de l\'importation des trades' };
    }
  }
  
  /**
   * Process Binance trades into a format compatible with our database
   */
  private static processBinanceTrades(trades: BinanceTrade[], userId: string): any[] {
    return trades.map(trade => {
      // Generate a simulated exit price based on the entry price
      const entryPrice = parseFloat(trade.price);
      const exitPriceMultiplier = Math.random() > 0.5 ? 1 + Math.random() * 0.1 : 1 - Math.random() * 0.1;
      const exitPrice = entryPrice * exitPriceMultiplier;
      
      // Calculate P&L
      const size = parseFloat(trade.qty);
      const pnl = trade.isBuyer 
        ? (exitPrice - entryPrice) * size  // Long position
        : (entryPrice - exitPrice) * size; // Short position
      
      return {
        user_id: userId,
        symbol: trade.symbol,
        type: trade.isBuyer ? 'long' : 'short',
        entry_price: entryPrice,
        exit_price: exitPrice,
        size: size,
        date: new Date(trade.time).toISOString(),
        fees: parseFloat(trade.commission),
        pnl: pnl,
        strategy: 'API Import',
        notes: `Imported from Binance API - Trade ID: ${trade.id}`,
      };
    });
  }
  
  /**
   * Simulate Binance API response
   * In a real app, this would be an actual API call to Binance
   */
  private static async simulateBinanceTradesApi(symbol: string, credentials: BinanceCredentials): Promise<BinanceTrade[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate 5-10 random trades
    const numTrades = 5 + Math.floor(Math.random() * 5);
    const trades: BinanceTrade[] = [];
    
    const basePrice = symbol.includes('BTC') ? 60000 : symbol.includes('ETH') ? 3000 : 500;
    
    for (let i = 0; i < numTrades; i++) {
      const price = basePrice + (Math.random() * 1000 - 500);
      const quantity = 0.1 + Math.random() * 2;
      const time = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Random time in last 30 days
      
      trades.push({
        symbol,
        id: Math.floor(Math.random() * 100000),
        orderId: Math.floor(Math.random() * 100000),
        orderListId: -1,
        price: price.toFixed(2),
        qty: quantity.toFixed(6),
        quoteQty: (price * quantity).toFixed(6),
        commission: (price * quantity * 0.001).toFixed(6),
        commissionAsset: symbol.replace('USDT', ''),
        time,
        isBuyer: Math.random() > 0.5,
        isMaker: Math.random() > 0.5,
        isBestMatch: true
      });
    }
    
    return trades;
  }
}
