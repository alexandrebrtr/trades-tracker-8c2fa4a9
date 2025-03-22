
import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
  });
  
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
  
  // Open event dialog for a specific day
  const openEventDialog = (day: number) => {
    const selectedDate = new Date(year, month, day);
    setNewEvent({
      title: '',
      description: '',
      date: selectedDate
    });
    setShowEventDialog(true);
  };
  
  // Save new event
  const saveEvent = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un événement.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newEvent.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de l'événement est requis.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date.toISOString(),
          user_id: user.id
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Événement ajouté au calendrier."
      });
      
      setShowEventDialog(false);
      if (onEventsUpdated) onEventsUpdated();
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'événement.",
        variant: "destructive"
      });
    }
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
          <Button 
            className="ml-4" 
            size="sm" 
            onClick={() => openEventDialog(new Date().getDate())}
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter un événement
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
            let bgColorClass = "";
            if (hasTrades) {
              bgColorClass = dailyPnL > 0 
                ? "hover:bg-green-500/10 bg-green-500/5" 
                : (dailyPnL < 0 
                  ? "hover:bg-red-500/10 bg-red-500/5" 
                  : "");
            }
            
            return (
              <div 
                key={`current-${day}`} 
                className={cn(
                  "border-t border-r h-24 p-1 relative group transition-colors duration-150 hover:bg-accent/10 cursor-pointer",
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
                  
                  {/* Add button (visible on hover) */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-5 h-5 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEventDialog(day);
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Daily PnL indicator */}
                {hasTrades && (
                  <div className={cn(
                    "text-xs px-1.5 py-0.5 rounded mt-1 inline-block",
                    dailyPnL > 0 
                      ? "bg-green-500/20 text-green-600" 
                      : "bg-red-500/20 text-red-600"
                  )}>
                    {dailyPnL > 0 ? "+" : ""}{dailyPnL.toLocaleString('fr-FR')} €
                  </div>
                )}
                
                {/* Calendar content container */}
                <div className="mt-1 space-y-1 max-h-[70px] overflow-y-auto">
                  {/* Event indicators */}
                  {dayEvents.length > 0 && (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div 
                          key={event.id} 
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded truncate",
                            event.type === 'trade' 
                              ? ((event.trade?.pnl > 0) 
                                ? "bg-green-500/10 text-green-500" 
                                : "bg-red-500/10 text-red-500")
                              : "bg-primary/10"
                          )}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-center text-muted-foreground">
                          +{dayEvents.length - 3} autres
                        </div>
                      )}
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
      
      {/* Add Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un événement</DialogTitle>
            <DialogDescription>
              Créez un nouvel événement pour {newEvent.date.toLocaleDateString('fr-FR')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input 
                id="title" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Réunion, rappel, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea 
                id="description" 
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Détails supplémentaires..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              Annuler
            </Button>
            <Button onClick={saveEvent}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
          onEventAdded={handleEventAdded}
        />
      )}
    </div>
  );
}
