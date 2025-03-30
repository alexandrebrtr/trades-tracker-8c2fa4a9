
import { useState, useEffect } from 'react';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { PortfolioDistribution } from '@/components/dashboard/PortfolioDistribution';
import { RecentTradesTable } from '@/components/dashboard/RecentTradesTable';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { DashboardData, Trade } from '@/services/DashboardData';
import { BrokerSyncNotification } from '@/components/dashboard/BrokerSyncNotification';
import { formatCurrency } from '@/utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [monthlyPnL, setMonthlyPnL] = useState(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [assetAllocation, setAssetAllocation] = useState<any[]>([]);
  const [strategyAllocation, setStrategyAllocation] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      loadDemoData();
    }
  }, [user]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const data = await DashboardData.fetchUserData(user!.id);
      
      setPortfolioBalance(data.portfolioBalance);
      setMonthlyPnL(data.monthlyPnL);
      setTrades(data.trades);
      setAssetAllocation(data.assetAllocation);
      setStrategyAllocation(data.strategyAllocation);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      loadDemoData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoData = () => {
    const demoData = DashboardData.generateDemoData();
    setPortfolioBalance(demoData.portfolioBalance);
    setMonthlyPnL(demoData.monthlyPnL);
    setTrades(demoData.trades);
    setAssetAllocation(demoData.assetAllocation);
    setStrategyAllocation(demoData.strategyAllocation);
    setIsLoading(false);
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
      <div className="page-transition">
        <DashboardHeader 
          portfolioBalance={portfolioBalance} 
          monthlyPnL={monthlyPnL} 
          formatCurrency={formatCurrency} 
        />
        
        {user && <BrokerSyncNotification />}
        
        <div className="grid gap-6">
          <PerformanceChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsDisplay 
              balance={portfolioBalance} 
              monthlyPnL={monthlyPnL} 
              trades={trades} 
            />
            <RecentTradesTable trades={trades} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
