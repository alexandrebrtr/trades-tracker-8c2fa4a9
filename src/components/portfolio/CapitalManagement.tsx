
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { DataCard } from '@/components/ui/data-card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CapitalManagementProps {
  portfolioId: string | null;
  portfolioSize: number;
  setPortfolioSize: (size: number) => void;
  trades: any[];
  formatCurrency: (value: number) => string;
}

export function CapitalManagement({ 
  portfolioId, 
  portfolioSize, 
  setPortfolioSize, 
  trades,
  formatCurrency 
}: CapitalManagementProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleDeposit = async () => {
    if (!user || !portfolioId) return;
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide supérieur à 0.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newBalance = portfolioSize + amount;
      
      const { error } = await supabase
        .from('portfolios')
        .update({ balance: newBalance })
        .eq('id', portfolioId);
      
      if (error) throw error;
      
      setPortfolioSize(newBalance);
      setDepositAmount('');
      
      toast({
        title: "Dépôt effectué",
        description: `${amount} € ont été ajoutés à votre portefeuille.`,
      });
    } catch (error) {
      console.error('Erreur lors du dépôt:', error);
      toast({
        title: "Erreur",
        description: "Le dépôt n'a pas pu être effectué. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async () => {
    if (!user || !portfolioId) return;
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide supérieur à 0.",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > portfolioSize) {
      toast({
        title: "Solde insuffisant",
        description: "Vous ne pouvez pas retirer plus que votre solde actuel.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newBalance = portfolioSize - amount;
      
      const { error } = await supabase
        .from('portfolios')
        .update({ balance: newBalance })
        .eq('id', portfolioId);
      
      if (error) throw error;
      
      setPortfolioSize(newBalance);
      setWithdrawAmount('');
      
      toast({
        title: "Retrait effectué",
        description: `${amount} € ont été retirés de votre portefeuille.`,
      });
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      toast({
        title: "Erreur",
        description: "Le retrait n'a pas pu être effectué. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gérer le capital</CardTitle>
        <CardDescription>
          Ajoutez ou retirez des fonds de votre portefeuille de trading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deposit">Déposer des fonds</Label>
            <div className="flex space-x-2">
              <Input
                id="deposit"
                placeholder="Montant"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <Button onClick={handleDeposit} className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Déposer</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdraw">Retirer des fonds</Label>
            <div className="flex space-x-2">
              <Input
                id="withdraw"
                placeholder="Montant"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <Button onClick={handleWithdraw} variant="outline" className="gap-2">
                <Minus className="h-4 w-4" />
                <span>Retirer</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Statistiques</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DataCard
              title="Solde du portefeuille"
              value={formatCurrency(portfolioSize)}
              icon={<Wallet className="w-4 h-4" />}
            />
            {trades.length > 0 && (
              <DataCard
                title="Performance totale"
                value={`${((trades.reduce((sum, trade) => sum + trade.pnl, 0) / portfolioSize) * 100).toFixed(2)}%`}
                icon={trades.reduce((sum, trade) => sum + trade.pnl, 0) > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                valueClassName={trades.reduce((sum, trade) => sum + trade.pnl, 0) > 0 ? "text-profit" : "text-loss"}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
