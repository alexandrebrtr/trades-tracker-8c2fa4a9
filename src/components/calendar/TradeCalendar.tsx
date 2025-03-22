
import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DayDetailView } from './DayDetailView';

// Define the event interface
export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  type: 'trade' | 'event';
  trade?: any;
  event?: any;
}

// Define the props interface for the TradeCalendar component
export interface TradeCalendarProps {
  events: CalendarEvent[];
  onEventsUpdated?: () => void;
}

export function TradeCalendar({ events, onEventsUpdated }: TradeCalendarProps) {
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
  
  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = event.date;
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };
  
  // Calculate daily PnL for a day
  const calculateDailyPnL = (day: number): number => {
    const dayTrades = events.filter(event => {
      const eventDate = event.date;
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year &&
             event.type === 'trade';
    });
    
    return dayTrades.reduce((total, event) => {
      return total + (event.trade?.pnl || 0);
    }, 0);
  };
  
  // Format month name
  const formatMonthName = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // View day detail
  const viewDayDetail = (day: number) => {
    const selectedDate = new Date(year, month, day);
    setSelectedDay(selectedDate);
  };
  
  // Handle event added in day detail view
  const handleEventAdded = () => {
    if (onEventsUpdated) onEventsUpdated();
  };
  
  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold capitalize">{formatMonthName(currentMonth)}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
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
        <div className="grid grid-cols-7 bg-card/70">
          {/* Previous month days */}
          {prevMonthDays.map((day) => (
            <div key={`prev-${day}`} className="border-t border-r h-24 p-1 text-muted-foreground/40">
              <span className="text-xs">{day}</span>
            </div>
          ))}
          
          {/* Current month days */}
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const dailyPnL = calculateDailyPnL(day);
            const hasTrades = dayEvents.some(event => event.type === 'trade');
            const isToday = new Date().getDate() === day && 
                            new Date().getMonth() === month && 
                            new Date().getFullYear() === year;
            
            // Determine background color based on PnL
            let bgColorClass = "hover:bg-accent/10";
            if (hasTrades) {
              bgColorClass = dailyPnL > 0 
                ? "bg-green-500/20 hover:bg-green-500/30" 
                : (dailyPnL < 0 
                  ? "bg-red-500/20 hover:bg-red-500/30" 
                  : "bg-gray-500/10 hover:bg-gray-500/20");
            }
            
            return (
              <div 
                key={`current-${day}`} 
                className={cn(
                  "border-t border-r h-24 p-2 relative transition-colors duration-150 cursor-pointer flex flex-col justify-between",
                  isToday ? "bg-primary/5" : "",
                  bgColorClass
                )}
                onClick={() => viewDayDetail(day)}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "inline-block w-6 h-6 rounded-full text-xs text-center leading-6",
                    isToday ? "bg-primary text-primary-foreground" : ""
                  )}>
                    {day}
                  </span>
                </div>
                
                {/* Daily PnL indicator - centered */}
                {hasTrades && (
                  <div className="flex-grow flex items-center justify-center">
                    <div className={cn(
                      "text-sm font-medium",
                      dailyPnL > 0 
                        ? "text-green-700 dark:text-green-400" 
                        : dailyPnL < 0
                          ? "text-red-700 dark:text-red-400"
                          : "text-muted-foreground"
                    )}>
                      {dailyPnL > 0 ? "+" : ""}{dailyPnL.toLocaleString('fr-FR')} €
                    </div>
                  </div>
                )}
                
                {/* Trade count badge */}
                {hasTrades && (
                  <div className="text-xs text-muted-foreground self-end">
                    {dayEvents.filter(e => e.type === 'trade').length} trade(s)
                  </div>
                )}
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
      
      {/* Day Detail View */}
      {selectedDay && (
        <DayDetailView 
          date={selectedDay} 
          events={events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === selectedDay.getDate() &&
                   eventDate.getMonth() === selectedDay.getMonth() &&
                   eventDate.getFullYear() === selectedDay.getFullYear();
          })}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
