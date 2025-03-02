
import { AppLayout } from '@/components/layout/AppLayout';
import { TradeCalendar } from '@/components/calendar/TradeCalendar';

const Calendar = () => {
  return (
    <AppLayout>
      <div className="page-transition">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Calendrier des Trades</h1>
        <TradeCalendar />
      </div>
    </AppLayout>
  );
};

export default Calendar;
