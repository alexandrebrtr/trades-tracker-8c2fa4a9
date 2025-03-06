
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TradeCalendar } from '@/components/calendar/TradeCalendar';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const Calendar = () => {
  const { isLoading, user } = useAuth();
  const { toast } = useToast();
  const [trades, setTrades] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    // Fetch user trades
    const fetchTrades = async () => {
      try {
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setTrades(data || []);
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };
    
    // Fetch user calendar events
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      }
    };
    
    fetchTrades();
    fetchEvents();
    
    // Set up real-time subscriptions
    const tradesChannel = supabase
      .channel('trades-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${user.id}`
        },
        () => fetchTrades()
      )
      .subscribe();
      
    const eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
          filter: `user_id=eq.${user.id}`
        },
        () => fetchEvents()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(tradesChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddEvent = async () => {
    if (!user) return;
    
    if (!eventForm.title.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez ajouter un titre pour votre événement",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date // This is already a string from the input
        });
        
      if (error) throw error;
      
      setIsDialogOpen(false);
      setEventForm({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Événement ajouté",
        description: "Votre événement a été ajouté au calendrier"
      });
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'événement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Prepare calendar data from trades and events
  const calendarData = [
    // Convert trades to calendar events
    ...trades.map(trade => ({
      id: trade.id,
      title: `Trade: ${trade.symbol} (${trade.type})`,
      description: `PnL: ${trade.pnl > 0 ? '+' : ''}${trade.pnl} €`,
      date: new Date(trade.date),
      type: 'trade',
      trade: trade
    })),
    // Add user events
    ...events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      type: 'event',
      event: event
    }))
  ];
  
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Calendrier des Trades</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un événement
          </Button>
        </div>
        
        <div className="glass-card p-6">
          <TradeCalendar events={calendarData} />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un événement</DialogTitle>
              <DialogDescription>
                Créez un nouvel événement dans votre calendrier
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  name="title"
                  value={eventForm.title}
                  onChange={handleInputChange}
                  placeholder="Titre de l'événement"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={eventForm.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={eventForm.description}
                  onChange={handleInputChange}
                  placeholder="Description de l'événement"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddEvent} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Calendar;
