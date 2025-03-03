
import { AppLayout } from '@/components/layout/AppLayout';
import { AnalyticsView } from '@/components/statistics/AnalyticsView';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const Statistics = () => {
  return (
    <AppLayout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Statistiques & Analyse</h1>
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
