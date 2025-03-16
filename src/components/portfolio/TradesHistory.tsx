
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Trade {
  id: string;
  date: Date;
  symbol: string;
  type: 'long' | 'short';
  entry_price: number;
  exit_price: number;
  size: number;
  pnl: number;
}

interface TradesHistoryProps {
  trades: Trade[];
  setTrades: React.Dispatch<React.SetStateAction<Trade[]>>;
}

export function TradesHistory({ trades, setTrades }: TradesHistoryProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showTrades, setShowTrades] = useState(false);

  const deleteTrade = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setTrades(prev => prev.filter(trade => trade.id !== id));
      
      toast({
        title: "Trade supprimé",
        description: "Le trade a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du trade:', error);
      toast({
        title: "Erreur",
        description: "Le trade n'a pas pu être supprimé. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Historique des transactions</CardTitle>
          <CardDescription>
            Dépôts, retraits et performances de trading
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowTrades(!showTrades)}
        >
          {showTrades ? "Masquer les trades" : "Afficher les trades"}
        </Button>
      </CardHeader>
      <CardContent>
        {showTrades ? (
          trades.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun trade enregistré. Commencez à ajouter vos trades dans la section "Ajouter un trade".</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Date</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Actif</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Type</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Prix d'entrée</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Prix de sortie</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Taille</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">P&L</th>
                    <th className="pb-2 font-medium text-muted-foreground text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="py-3 text-sm">
                        {trade.date.toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 text-sm font-medium">{trade.symbol}</td>
                      <td className="py-3 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          trade.type === 'long' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'
                        }`}>
                          {trade.type === 'long' ? 'Long' : 'Short'}
                        </span>
                      </td>
                      <td className="py-3 text-sm">{trade.entry_price}</td>
                      <td className="py-3 text-sm">{trade.exit_price}</td>
                      <td className="py-3 text-sm">{trade.size}</td>
                      <td className={`py-3 text-sm font-semibold ${
                        trade.pnl > 0 ? 'text-profit' : trade.pnl < 0 ? 'text-loss' : ''
                      }`}>
                        {trade.pnl > 0 ? '+' : ''}{trade.pnl} €
                      </td>
                      <td className="py-3 text-sm">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => deleteTrade(trade.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cliquez sur "Afficher les trades" pour voir l'historique de vos trades.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
