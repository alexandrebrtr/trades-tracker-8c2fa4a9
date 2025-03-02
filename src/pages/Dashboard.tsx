
import { Suspense } from 'react';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { PortfolioDistribution } from '@/components/dashboard/PortfolioDistribution';
import { AppLayout } from '@/components/layout/AppLayout';

const Dashboard = () => {
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
              <p className="text-xl font-bold">15,234.75 €</p>
            </div>
            <div className="h-full w-px bg-border mx-1"></div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">P&L Mensuel</p>
              <p className="text-xl font-bold text-profit">+1,879.50 €</p>
            </div>
          </div>
        </div>
        
        <StatsDisplay />
        
        <PerformanceChart className="mt-8" />
        
        <PortfolioDistribution />
        
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4">Trades récents</h3>
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
                {[
                  { date: '15/05/2023', asset: 'BTC/USD', type: 'Long', entry: '27,856.00', exit: '28,142.00', size: '0.5', pnl: '+143.00', profit: true },
                  { date: '14/05/2023', asset: 'AAPL', type: 'Short', entry: '174.20', exit: '172.80', size: '10', pnl: '+140.00', profit: true },
                  { date: '12/05/2023', asset: 'EUR/USD', type: 'Long', entry: '1.0876', exit: '1.0856', size: '1000', pnl: '-20.00', profit: false },
                  { date: '10/05/2023', asset: 'TSLA', type: 'Long', entry: '180.50', exit: '183.25', size: '5', pnl: '+137.50', profit: true },
                  { date: '08/05/2023', asset: 'ETH/USD', type: 'Short', entry: '1,840.00', exit: '1,860.00', size: '2', pnl: '-40.00', profit: false },
                ].map((trade, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="py-3 text-sm">{trade.date}</td>
                    <td className="py-3 text-sm font-medium">{trade.asset}</td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        trade.type === 'Long' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-3 text-sm">{trade.entry}</td>
                    <td className="py-3 text-sm">{trade.exit}</td>
                    <td className="py-3 text-sm">{trade.size}</td>
                    <td className={`py-3 text-sm font-semibold ${trade.profit ? 'text-profit' : 'text-loss'}`}>
                      {trade.pnl} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
