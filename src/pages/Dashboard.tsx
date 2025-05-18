
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
import { formatCurrency as formatCurrencyUtil } from '@/utils/formatters';
import { useLanguage } from '@/context/LanguageContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [monthlyPnL, setMonthlyPnL] = useState(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [assetAllocation, setAssetAllocation] = useState<any[]>([]);
  const [strategyAllocation, setStrategyAllocation] = useState<any[]>([]);

  useEffect(() => {
    // Si l'utilisateur est connecté, charger ses données réelles
    if (user) {
      loadUserData();
    } else {
      // Sinon, utiliser des données fictives
      loadDemoData();
    }
  }, [user]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Récupérer toutes les données utilisateur sans filtrage par date
      const data = await DashboardData.fetchUserData(user!.id);
      
      setPortfolioBalance(data.portfolioBalance);
      setMonthlyPnL(data.monthlyPnL);
      setTrades(data.trades);
      setAssetAllocation(data.assetAllocation);
      setStrategyAllocation(data.strategyAllocation);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // En cas d'erreur, utiliser des données fictives
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">{t('dashboard.loading')}</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full space-y-8">
        <DashboardHeader 
          portfolioBalance={portfolioBalance}
          monthlyPnL={monthlyPnL}
          formatCurrency={formatCurrency}
        />
        
        <StatsDisplay 
          balance={portfolioBalance}
          monthlyPnL={monthlyPnL}
          trades={trades || []}
        />
        
        <PerformanceChart className="w-full mt-8" userId={user?.id} />
        
        <PortfolioDistribution 
          assetData={assetAllocation && assetAllocation.length > 0 ? assetAllocation : null}
          strategyData={strategyAllocation && strategyAllocation.length > 0 ? strategyAllocation : null}
        />
        
        <RecentTradesTable trades={trades || []} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
