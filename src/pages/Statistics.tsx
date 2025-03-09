
import { AppLayout } from '@/components/layout/AppLayout';
import { AnalyticsView } from '@/components/statistics/AnalyticsView';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Wallet, Star } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';

const Statistics = () => {
  const { isPremium } = usePremium();
  
  return (
    <AppLayout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Statistiques & Analyse</h1>
            {isPremium && (
              <div className="flex items-center text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full border border-yellow-500/20">
                <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                Analyses Premium
              </div>
            )}
          </div>
          <Button variant="outline" asChild>
            <Link to="/portfolio" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>Gérer le portefeuille</span>
            </Link>
          </Button>
        </div>
        <AnalyticsView />
      </div>
    </AppLayout>
  );
};

export default Statistics;
