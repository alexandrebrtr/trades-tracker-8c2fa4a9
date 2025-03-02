
import { Navbar } from '@/components/navigation/Navbar';
import { TradeCalendar } from '@/components/calendar/TradeCalendar';

const Calendar = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 page-container">
        <div className="page-transition">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Calendrier des Trades</h1>
          <TradeCalendar />
        </div>
      </main>
    </>
  );
};

export default Calendar;
