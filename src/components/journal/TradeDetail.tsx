
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ArrowUp, ArrowDown, DollarSign, BarChart, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Trade {
  id: string;
  date: string;
  symbol: string;
  type: 'long' | 'short';
  strategy: string | null;
  entry_price: number;
  exit_price: number;
  size: number;
  fees: number | null;
  pnl: number | null;
  notes: string | null;
}

interface TradeDetailProps {
  trade: Trade;
  onClose: () => void;
}

export function TradeDetail({ trade, onClose }: TradeDetailProps) {
  const [activeTab, setActiveTab] = useState('summary');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 5
    }).format(value);
  };

  // Calculer le pourcentage de gain/perte
  const calculatePercentage = () => {
    if (!trade.pnl || !trade.entry_price || !trade.size) return 0;
    const invested = trade.entry_price * trade.size;
    return (trade.pnl / invested) * 100;
  };

  const percentChange = calculatePercentage();

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg animate-fade-in">
      <CardHeader className={cn(
        "flex flex-row items-center justify-between border-b border-l-4",
        trade.pnl && trade.pnl > 0 ? "border-l-profit" : "border-l-loss"
      )}>
        <div>
          <CardTitle className="text-xl">{trade.symbol}</CardTitle>
          <div className="flex items-center gap-3 mt-1">
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              trade.type === 'long' ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
            )}>
              {trade.type === 'long' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {trade.type === 'long' ? 'LONG' : 'SHORT'}
            </span>
            {trade.strategy && (
              <span className="text-sm text-muted-foreground">{trade.strategy}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={cn(
            "text-xl font-bold",
            trade.pnl && trade.pnl > 0 ? "text-profit" : "text-loss"
          )}>
            {trade.pnl !== null ? (trade.pnl > 0 ? '+' : '') + formatCurrency(trade.pnl) : '--'}
          </div>
          {percentChange !== 0 && (
            <div className={cn(
              "text-sm",
              percentChange > 0 ? "text-profit" : "text-loss"
            )}>
              {percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Résumé</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="summary" className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date
                </p>
                <p className="font-medium">{formatDate(trade.date)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <BarChart className="w-4 h-4 mr-2" />
                  Résultat
                </p>
                <p className={cn(
                  "font-medium",
                  trade.pnl && trade.pnl > 0 ? "text-profit" : "text-loss"
                )}>
                  {trade.pnl !== null ? formatCurrency(trade.pnl) : '--'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Prix d'entrée
                </p>
                <p className="font-medium">{formatCurrency(trade.entry_price)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Prix de sortie
                </p>
                <p className="font-medium">{formatCurrency(trade.exit_price)}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Taille de position
                </p>
                <p className="font-medium">{trade.size}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Frais
                </p>
                <p className="font-medium">{trade.fees !== null ? formatCurrency(trade.fees) : '--'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Stratégie
                </p>
                <p className="font-medium">{trade.strategy || '--'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date et heure
                </p>
                <p className="font-medium">{formatDate(trade.date)}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="px-6 py-4">
            {trade.notes ? (
              <div className="p-4 bg-muted/20 rounded-md">
                <p>{trade.notes}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">Aucune note pour ce trade.</p>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="p-6 pt-2 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </CardContent>
    </Card>
  );
}
