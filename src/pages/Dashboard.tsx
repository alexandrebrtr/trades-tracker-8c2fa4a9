
import { useState, useEffect } from 'react';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { PortfolioDistribution } from '@/components/dashboard/PortfolioDistribution';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [monthlyPnL, setMonthlyPnL] = useState(0);
  const [trades, setTrades] = useState<any[]>([]);
  const [assetAllocation, setAssetAllocation] = useState<any[]>([]);
  const [strategyAllocation, setStrategyAllocation] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les données du portfolio
        const { data: portfolios, error: portfolioError } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);
        
        if (portfolioError) throw portfolioError;
        
        if (portfolios && portfolios.length > 0) {
          setPortfolioBalance(portfolios[0].balance);
          
          // Récupérer les allocations d'actifs
          const { data: allocations, error: allocationsError } = await supabase
            .from('asset_allocations')
            .select('*')
            .eq('portfolio_id', portfolios[0].id);
          
          if (allocationsError) throw allocationsError;
          
          if (allocations && allocations.length > 0) {
            setAssetAllocation(allocations.map(a => ({
              name: a.name,
              value: a.allocation
            })));
          }
        }
        
        // Récupérer les trades
        const { data: tradesData, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(5);
        
        if (tradesError) throw tradesError;
        
        if (tradesData && tradesData.length > 0) {
          setTrades(tradesData);
          
          // Calculer le P&L mensuel
          const now = new Date();
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          
          const monthlyTrades = tradesData.filter(trade => 
            new Date(trade.date) >= firstDayOfMonth
          );
          
          const monthlyProfit = monthlyTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
          setMonthlyPnL(monthlyProfit);
          
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
          
          const strategyData = Object.entries(strategies).map(([name, count]) => ({
            name,
            value: Math.round((count / tradesData.length) * 100)
          }));
          
          setStrategyAllocation(strategyData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Chargement de votre tableau de bord...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Vue d'ensemble de vos performances de trading
            </p>
          </div>
          
          <div className="glass-panel px-4 py-3 flex gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Solde actuel</p>
              <p className="text-xl font-bold">{formatCurrency(portfolioBalance)}</p>
            </div>
            <div className="h-full w-px bg-border mx-1"></div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">P&L Mensuel</p>
              <p className={`text-xl font-bold ${monthlyPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                {monthlyPnL >= 0 ? '+' : ''}{formatCurrency(monthlyPnL)}
              </p>
            </div>
          </div>
        </div>
        
        <StatsDisplay 
          balance={portfolioBalance}
          monthlyPnL={monthlyPnL}
          trades={trades}
        />
        
        <PerformanceChart className="mt-8" userId={user?.id} />
        
        <PortfolioDistribution 
          assetData={assetAllocation.length > 0 ? assetAllocation : null}
          strategyData={strategyAllocation.length > 0 ? strategyAllocation : null}
        />
        
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4">Trades récents</h3>
          {trades.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun trade enregistré. Commencez à ajouter vos trades dans la section "Ajouter un trade".</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Date</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Actif</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Type</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Prix d'entrée</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Prix de sortie</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Taille</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="py-3 text-sm">
                        {new Date(trade.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 text-sm font-medium">{trade.symbol}</td>
                      <td className="py-3 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          trade.type === 'long' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'
                        }`}>
                          {trade.type === 'long' ? 'Long' : 'Short'}
                        </span>
                      </td>
                      <td className="py-3 text-sm">{trade.entry_price}</td>
                      <td className="py-3 text-sm">{trade.exit_price}</td>
                      <td className="py-3 text-sm">{trade.size}</td>
                      <td className={`py-3 text-sm font-semibold ${
                        trade.pnl > 0 ? 'text-profit' : trade.pnl < 0 ? 'text-loss' : ''
                      }`}>
                        {trade.pnl > 0 ? '+' : ''}{trade.pnl} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
