
import { Navbar } from '@/components/navigation/Navbar';
import { AnalyticsView } from '@/components/statistics/AnalyticsView';

const Statistics = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 page-container">
        <div className="page-transition">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Statistiques & Analyse</h1>
          <AnalyticsView />
        </div>
      </main>
    </>
  );
};

export default Statistics;
