
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardHeaderProps {
  portfolioBalance: number;
  monthlyPnL: number;
  formatCurrency: (value: number) => string;
}

export function DashboardHeader({ portfolioBalance, monthlyPnL, formatCurrency }: DashboardHeaderProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.overview')}
        </p>
        
        {!user && (
          <div className="mt-4">
            <p className="mb-2 text-muted-foreground">
              {t('dashboard.demo')}
            </p>
            <Button asChild>
              <Link to="/login">{t('dashboard.login')}</Link>
            </Button>
          </div>
        )}
      </div>
      
      <div className="glass-panel px-4 py-3 flex gap-3">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{t('dashboard.currentBalance')}</p>
          <p className="text-xl font-bold">{formatCurrency(portfolioBalance)}</p>
        </div>
        <div className="h-full w-px bg-border mx-1"></div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{t('dashboard.monthlyPnL')}</p>
          <p className={`text-xl font-bold ${monthlyPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
            {monthlyPnL >= 0 ? '+' : ''}{formatCurrency(monthlyPnL)}
          </p>
        </div>
      </div>
    </div>
  );
}
