
import { supabase } from '@/integrations/supabase/client';

export interface Trade {
  id: string;
  date: Date | string;
  symbol: string;
  type: string;
  entry_price: number;
  exit_price: number;
  size: number;
  pnl: number;
  strategy?: string;
}

export const DashboardData = {
  async fetchUserData(userId: string, accountId?: string | null) {
    let portfolioBalance = 0;
    let monthlyPnL = 0;
    let trades: Trade[] = [];
    let assetAllocation: any[] = [];
    let strategyAllocation: any[] = [];

    try {
      // Solde du compte actif (si fourni)
      if (accountId) {
        const { data: acc } = await supabase
          .from('trading_accounts' as any)
          .select('balance')
          .eq('id', accountId)
          .maybeSingle();
        if (acc) portfolioBalance = Number((acc as any).balance) || 0;
      }

      // Récupérer les trades du compte actif
      let tradesQuery = supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(5);
      if (accountId) tradesQuery = tradesQuery.eq('account_id', accountId);
      const { data: tradesData, error: tradesError } = await tradesQuery;
      
      if (tradesError) throw tradesError;
      
      if (tradesData && tradesData.length > 0) {
        trades = tradesData;
        
        // Calculer le P&L mensuel
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyTrades = tradesData.filter(trade => 
          new Date(trade.date) >= firstDayOfMonth
        );
        
        monthlyPnL = monthlyTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        
        // Calculer la répartition par stratégie
        const strategies: Record<string, number> = {};
        tradesData.forEach(trade => {
          if (trade.strategy) {
            if (!strategies[trade.strategy]) {
              strategies[trade.strategy] = 0;
            }
            strategies[trade.strategy]++;
          }
        });
        
        strategyAllocation = Object.entries(strategies).map(([name, count]) => ({
          name,
          value: Math.round((count / tradesData.length) * 100)
        }));
      }

      return {
        portfolioBalance,
        monthlyPnL,
        trades,
        assetAllocation,
        strategyAllocation
      };
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      throw error;
    }
  },

  generateDemoData() {
    const portfolioBalance = 25000;
    const monthlyPnL = 1250;
    
    // Trades de démonstration
    const trades = [
      {
        id: 'demo1',
        date: new Date(2023, 11, 15),
        symbol: 'AAPL',
        type: 'long',
        entry_price: 175.50,
        exit_price: 182.30,
        size: 10,
        pnl: 68
      },
      {
        id: 'demo2',
        date: new Date(2023, 11, 16),
        symbol: 'MSFT',
        type: 'long',
        entry_price: 350.20,
        exit_price: 358.80,
        size: 5,
        pnl: 43
      },
      {
        id: 'demo3',
        date: new Date(2023, 11, 17),
        symbol: 'TSLA',
        type: 'short',
        entry_price: 252.40,
        exit_price: 245.70,
        size: 8,
        pnl: 53.6
      },
      {
        id: 'demo4',
        date: new Date(2023, 11, 18),
        symbol: 'AMZN',
        type: 'long',
        entry_price: 142.80,
        exit_price: 138.90,
        size: 15,
        pnl: -58.5
      },
      {
        id: 'demo5',
        date: new Date(2023, 11, 19),
        symbol: 'NVDA',
        type: 'long',
        entry_price: 460.20,
        exit_price: 485.10,
        size: 3,
        pnl: 74.7
      }
    ];
    
    // Allocation d'actifs de démonstration
    const assetAllocation = [
      { name: 'Actions', value: 60 },
      { name: 'Obligations', value: 20 },
      { name: 'Liquidités', value: 15 },
      { name: 'Crypto', value: 5 }
    ];
    
    // Allocation par stratégie de démonstration
    const strategyAllocation = [
      { name: 'Day Trading', value: 45 },
      { name: 'Swing Trading', value: 30 },
      { name: 'Position', value: 15 },
      { name: 'Scalping', value: 10 }
    ];

    return {
      portfolioBalance,
      monthlyPnL,
      trades,
      assetAllocation,
      strategyAllocation
    };
  }
};
