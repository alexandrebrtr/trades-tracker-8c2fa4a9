
import { AppLayout } from '@/components/layout/AppLayout';
import { TradeCalendar } from '@/components/calendar/TradeCalendar';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const Calendar = () => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
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
