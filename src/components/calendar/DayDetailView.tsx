
import { useState, useEffect } from 'react';
import { format, isSameDay, isAfter } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { X, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarEvent } from './TradeCalendar';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DayDetailViewProps {
  date: Date | null;
  events: CalendarEvent[];
  onClose: () => void;
}

export function DayDetailView({ date, events, onClose }: DayDetailViewProps) {
  const { toast } = useToast();
  const [dailyPnL, setDailyPnL] = useState(0);
  const [trades, setTrades] = useState<any[]>([]);
  const [isFutureDate, setIsFutureDate] = useState(false);

  // Calculate daily PnL and get trades
  useEffect(() => {
    if (!date) return;
    
    // Check if the date is in the future
    const today = new Date();
    const isFuture = isAfter(date, today);
    setIsFutureDate(isFuture);
    
    const tradesArray = events.filter(event => event.type === 'trade');
    const totalPnL = tradesArray.reduce((total, trade) => total + (trade.trade?.pnl || 0), 0);
    
    setTrades(tradesArray);
    setDailyPnL(totalPnL);
  }, [events, date]);

  if (!date) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{format(date, 'EEEE d MMMM yyyy')}</h2>
            {!isFutureDate && (
              <div className={cn(
                "mt-1 text-sm font-medium",
                dailyPnL > 0 ? "text-green-500" : dailyPnL < 0 ? "text-red-500" : "text-muted-foreground"
              )}>
                Résultat du jour: {dailyPnL > 0 ? "+" : ""}{dailyPnL.toLocaleString('fr-FR')} €
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Trades section */}
          {isFutureDate ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucune donnée disponible pour les dates futures.
            </div>
          ) : trades.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trades du jour ({trades.length})
              </h3>
              
              {trades.map((event) => (
                <Card key={event.id} className={cn(
                  "overflow-hidden",
                  event.trade?.pnl > 0 ? "border-green-500/20" : "border-red-500/20"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{event.trade?.symbol}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Type: {event.trade?.type} | Taille: {event.trade?.size}
                        </div>
                        {event.trade?.strategy && (
                          <Badge variant="outline" className="mt-2">
                            {event.trade?.strategy}
                          </Badge>
                        )}
                      </div>
                      <div className={cn(
                        "font-medium text-right",
                        event.trade?.pnl > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {event.trade?.pnl > 0 ? "+" : ""}{event.trade?.pnl.toLocaleString('fr-FR')} €
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(event.date), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                    {event.trade?.notes && (
                      <div className="mt-3 text-sm border-t pt-2 border-border">
                        <p className="text-muted-foreground">{event.trade?.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Aucun trade pour ce jour.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
