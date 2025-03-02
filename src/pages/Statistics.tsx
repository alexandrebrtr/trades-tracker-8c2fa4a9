
import { AppLayout } from '@/components/layout/AppLayout';
import { AnalyticsView } from '@/components/statistics/AnalyticsView';

const Statistics = () => {
  return (
    <AppLayout>
      <div className="page-transition">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Statistiques & Analyse</h1>
        <AnalyticsView />
      </div>
    </AppLayout>
  );
};

export default Statistics;
