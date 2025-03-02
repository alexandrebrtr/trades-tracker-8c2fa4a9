
import { AppLayout } from '@/components/layout/AppLayout';
import { TradeForm } from '@/components/forms/TradeForm';

const TradeEntry = () => {
  return (
    <AppLayout>
      <div className="page-transition">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Nouveau Trade</h1>
        <TradeForm />
      </div>
    </AppLayout>
  );
};

export default TradeEntry;
