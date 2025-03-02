
import { Navbar } from '@/components/navigation/Navbar';
import { TradeForm } from '@/components/forms/TradeForm';

const TradeEntry = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 page-container">
        <div className="page-transition">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Nouveau Trade</h1>
          <TradeForm />
        </div>
      </main>
    </>
  );
};

export default TradeEntry;
