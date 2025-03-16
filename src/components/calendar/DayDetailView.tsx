
import { useState, useEffect } from 'react';
import { format, addHours, isSameDay, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarEvent } from './TradeCalendar';

interface TimeSlot {
  time: Date;
  events: CalendarEvent[];
}

interface DayDetailViewProps {
  date: Date | null;
  events: CalendarEvent[];
  onClose: () => void;
  onEventAdded: () => void;
}

export function DayDetailView({ date, events, onClose, onEventAdded }: DayDetailViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate time slots for the day (8AM to 10PM)
  useEffect(() => {
    if (!date) return;

    const slots: TimeSlot[] = [];
    const startHour = 8; // 8AM
    const endHour = 22; // 10PM

    // Create a date object for the start time
    const startTime = new Date(date);
    startTime.setHours(startHour, 0, 0, 0);

    // Generate slots for each hour
    for (let i = 0; i <= (endHour - startHour); i++) {
      const slotTime = addHours(startTime, i);
      
      // Find events for this time slot
      const slotEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return isSameDay(eventDate, date) && eventDate.getHours() === slotTime.getHours();
      });

      slots.push({
        time: slotTime,
        events: slotEvents
      });
    }

    setTimeSlots(slots);
  }, [date, events]);

  // Handle adding a new event at a specific time
  const handleAddEvent = (time: Date) => {
    setSelectedTime(time);
    setNewEvent({
      title: '',
      description: '',
      time: format(time, 'HH:mm'),
    });
    setShowEventDialog(true);
  };

  // Save the new event
  const saveEvent = async () => {
    if (!user || !date || !selectedTime) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté et sélectionner une date et heure valides.",
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
    
    setIsSubmitting(true);
    
    try {
      // Create a date object with the selected date and time
      const eventDate = new Date(date);
      const [hours, minutes] = newEvent.time.split(':').map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
      
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          date: eventDate.toISOString(),
          user_id: user.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Événement ajouté au calendrier."
      });
      
      setShowEventDialog(false);
      onEventAdded();
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'événement.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!date) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">{format(date, 'EEEE d MMMM yyyy')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {timeSlots.map((slot, index) => (
            <div 
              key={index} 
              className="flex items-start py-2 border-b last:border-b-0 group"
            >
              <div className="w-20 text-sm font-medium text-muted-foreground pt-1">
                {format(slot.time, 'HH:mm')}
              </div>
              
              <div className="flex-1 min-h-[60px] space-y-2">
                {slot.events.map(event => (
                  <div 
                    key={event.id}
                    className={cn(
                      "p-2 rounded-md text-sm",
                      event.type === 'trade' 
                        ? event.trade?.pnl > 0 
                            ? "bg-green-500/10 text-green-600" 
                            : "bg-red-500/10 text-red-600"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.description && (
                      <div className="text-xs mt-1 opacity-80">{event.description}</div>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleAddEvent(slot.time)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un événement</DialogTitle>
            <DialogDescription>
              {selectedTime && (
                <span className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(selectedTime, 'HH:mm')} - {format(date, 'EEEE d MMMM yyyy')}
                </span>
              )}
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
              <Label htmlFor="time">Heure</Label>
              <Input 
                id="time" 
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
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
            <Button onClick={saveEvent} disabled={isSubmitting}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
