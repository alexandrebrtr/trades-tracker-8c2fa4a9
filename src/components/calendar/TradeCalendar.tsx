
import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Generate mock trades
const generateMockTrades = () => {
  const trades = [];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Generate 20-40 trades spread across the month
  const numberOfTrades = Math.floor(Math.random() * 20) + 20;
  
  for (let i = 0; i < numberOfTrades; i++) {
    const day = Math.floor(Math.random() * 28) + 1;
    const profit = Math.random() > 0.6; // 60% winning trades
    const amount = profit 
      ? Math.random() * 200 + 50 
      : -(Math.random() * 150 + 30);
    
    const asset = ['BTC/USD', 'EUR/USD', 'AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOLD'];
    const randomAsset = asset[Math.floor(Math.random() * asset.length)];
    
    const hours = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
    const minutes = Math.floor(Math.random() * 60);
    const duration = Math.floor(Math.random() * 180) + 15; // 15min to 3h
    
    trades.push({
      id: i,
      date: new Date(year, month, day),
      asset: randomAsset,
      amount: Math.round(amount * 100) / 100,
      openTime: `${hours}:${minutes < 10 ? '0' + minutes : minutes}`,
      duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
    });
  }
  
  return trades;
};

const mockTrades = generateMockTrades();

export function TradeCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  // Get current month info
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust for Monday as first day (0 = Monday, 6 = Sunday)
  const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  // Previous month days
  const prevMonthDays = [];
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = prevMonthLastDate - firstDay + 1; i <= prevMonthLastDate; i++) {
    prevMonthDays.push(i);
  }
  
  // Current month days
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  // Next month days
  const nextMonthDays = [];
  const totalCells = 42; // 6 rows x 7 days
  const remainingCells = totalCells - prevMonthDays.length - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(i);
  }
  
  // Navigate to previous/next month
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  // Get trades for a specific day
  const getTradesForDay = (day: number) => {
    return mockTrades.filter(trade => {
      const tradeDate = trade.date;
      return tradeDate.getDate() === day && 
             tradeDate.getMonth() === month && 
             tradeDate.getFullYear() === year;
    });
  };
  
  // Format month name
  const formatMonthName = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold capitalize">{formatMonthName(currentMonth)}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button className="ml-4" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Nouveau Trade
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Day names header */}
        <div className="grid grid-cols-7 bg-secondary/50">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 bg-white">
          {/* Previous month days */}
          {prevMonthDays.map((day) => (
            <div key={`prev-${day}`} className="border-t border-r h-24 p-1 text-muted-foreground/40">
              <span className="text-xs">{day}</span>
            </div>
          ))}
          
          {/* Current month days */}
          {days.map((day) => {
            const dayTrades = getTradesForDay(day);
            const isToday = new Date().getDate() === day && 
                            new Date().getMonth() === month && 
                            new Date().getFullYear() === year;
            
            return (
              <div 
                key={`current-${day}`} 
                className={cn(
                  "border-t border-r h-24 p-1 relative",
                  isToday ? "bg-primary/5" : ""
                )}
                onClick={() => setSelectedDay(new Date(year, month, day))}
              >
                <span className={cn(
                  "inline-block w-6 h-6 rounded-full text-xs text-center leading-6",
                  isToday ? "bg-primary text-white" : ""
                )}>
                  {day}
                </span>
                
                {/* Trade indicators */}
                <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                  {dayTrades.slice(0, 3).map((trade) => (
                    <div 
                      key={trade.id} 
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded truncate",
                        trade.amount > 0 ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
                      )}
                      title={`${trade.asset}: ${trade.amount > 0 ? '+' : ''}${trade.amount}€`}
                    >
                      {trade.asset}: {trade.amount > 0 ? '+' : ''}{trade.amount}€
                    </div>
                  ))}
                  
                  {dayTrades.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground">
                      +{dayTrades.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Next month days */}
          {nextMonthDays.map((day) => (
            <div key={`next-${day}`} className="border-t border-r h-24 p-1 text-muted-foreground/40">
              <span className="text-xs">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
