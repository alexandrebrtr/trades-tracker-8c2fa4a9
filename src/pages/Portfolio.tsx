
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Minus, 
  Trash, 
  Wallet, 
  BarChart3, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { DataCard } from '@/components/ui/data-card';

interface Trade {
  id: string;
  date: Date;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
}

interface Asset {
  id: string;
  name: string;
  allocation: number;
}

export default function Portfolio() {
  const { toast } = useToast();
  const [portfolioSize, setPortfolioSize] = useState(10000);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showTrades, setShowTrades] = useState(false);
  
  // Mock data - in a real app, this would come from a database
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Actions', allocation: 40 },
    { id: '2', name: 'Crypto', allocation: 30 },
    { id: '3', name: 'Forex', allocation: 20 },
    { id: '4', name: 'Matières premières', allocation: 10 },
  ]);
  
  const [trades, setTrades] = useState<Trade[]>([
    { 
      id: '1', 
      date: new Date(2023, 4, 15), 
      symbol: 'BTC/USD', 
      type: 'long', 
      entryPrice: 27856, 
      exitPrice: 28142, 
      size: 0.5, 
      pnl: 143 
    },
    { 
      id: '2', 
      date: new Date(2023, 4, 14), 
      symbol: 'AAPL', 
      type: 'short', 
      entryPrice: 174.20, 
      exitPrice: 172.80, 
      size: 10, 
      pnl: 140 
    }
  ]);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide supérieur à 0.",
        variant: "destructive",
      });
      return;
    }
    
    setPortfolioSize(prev => prev + amount);
    setDepositAmount('');
    
    toast({
      title: "Dépôt effectué",
      description: `${amount} € ont été ajoutés à votre portefeuille.`,
    });
  };

  const handleWithdraw = () => {
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
    
    setPortfolioSize(prev => prev - amount);
    setWithdrawAmount('');
    
    toast({
      title: "Retrait effectué",
      description: `${amount} € ont été retirés de votre portefeuille.`,
    });
  };

  const deleteTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
    toast({
      title: "Trade supprimé",
      description: "Le trade a été supprimé avec succès.",
    });
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => {
      const assetToDelete = prev.find(a => a.id === id);
      if (!assetToDelete) return prev;
      
      // Redistribution de l'allocation
      const newAssets = prev.filter(a => a.id !== id);
      if (newAssets.length === 0) return [];
      
      const totalAllocationLeft = newAssets.reduce((sum, a) => sum + a.allocation, 0);
      const factor = 100 / totalAllocationLeft;
      
      return newAssets.map(a => ({
        ...a,
        allocation: Math.round(a.allocation * factor)
      }));
    });
    
    toast({
      title: "Actif supprimé",
      description: "L'actif a été supprimé avec succès.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Portefeuille</h1>
          <div className="glass-panel px-4 py-3 flex gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Solde actuel</p>
              <p className="text-xl font-bold">{formatCurrency(portfolioSize)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <DataCard
                    title="Performance totale"
                    value="+12.4%"
                    icon={<TrendingUp className="w-4 h-4" />}
                    valueClassName="text-profit"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des actifs</CardTitle>
              <CardDescription>
                Gérez la répartition de votre portefeuille par type d'actif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map(asset => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{asset.name}</span>
                        <span className="text-sm">{asset.allocation}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ width: `${asset.allocation}%` }}
                        />
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 h-8 w-8" 
                      onClick={() => deleteAsset(asset.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => {
                    toast({
                      title: "Fonctionnalité à venir",
                      description: "L'ajout d'actifs sera disponible prochainement.",
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un actif
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

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
                        <td className="py-3 text-sm">{trade.entryPrice}</td>
                        <td className="py-3 text-sm">{trade.exitPrice}</td>
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
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cliquez sur "Afficher les trades" pour voir l'historique de vos trades.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
