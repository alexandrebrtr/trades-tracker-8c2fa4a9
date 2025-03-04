
import { useState, useEffect } from 'react';
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
  TrendingDown,
  Loader2
} from 'lucide-react';
import { DataCard } from '@/components/ui/data-card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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

interface Asset {
  id: string;
  name: string;
  allocation: number;
}

export default function Portfolio() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [portfolioSize, setPortfolioSize] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showTrades, setShowTrades] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetAllocation, setNewAssetAllocation] = useState('');
  const [showAssetForm, setShowAssetForm] = useState(false);
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  // Charger les données du portfolio de l'utilisateur
  useEffect(() => {
    if (!user) return;
    
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      try {
        // Vérifier si l'utilisateur a déjà un portfolio
        const { data: portfolios, error: portfolioError } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);
        
        if (portfolioError) throw portfolioError;
        
        let currentPortfolioId;
        
        // Si pas de portfolio, en créer un
        if (!portfolios || portfolios.length === 0) {
          const { data: newPortfolio, error: createError } = await supabase
            .from('portfolios')
            .insert([{ user_id: user.id }])
            .select()
            .single();
          
          if (createError) throw createError;
          setPortfolioSize(0);
          currentPortfolioId = newPortfolio.id;
        } else {
          setPortfolioSize(portfolios[0].balance);
          currentPortfolioId = portfolios[0].id;
        }
        
        setPortfolioId(currentPortfolioId);
        
        // Charger les allocations d'actifs
        if (currentPortfolioId) {
          const { data: allocations, error: allocationsError } = await supabase
            .from('asset_allocations')
            .select('*')
            .eq('portfolio_id', currentPortfolioId);
          
          if (allocationsError) throw allocationsError;
          
          if (allocations && allocations.length > 0) {
            setAssets(allocations.map(a => ({
              id: a.id,
              name: a.name,
              allocation: a.allocation
            })));
          }
        }
        
        // Charger les trades
        const { data: tradesData, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10);
        
        if (tradesError) throw tradesError;
        
        if (tradesData && tradesData.length > 0) {
          setTrades(tradesData.map(t => ({
            id: t.id,
            date: new Date(t.date),
            symbol: t.symbol,
            type: t.type.toLowerCase() as 'long' | 'short',
            entry_price: t.entry_price,
            exit_price: t.exit_price,
            size: t.size,
            pnl: t.pnl || 0
          })));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos données. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolioData();
  }, [user, toast]);

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

  const addAsset = async () => {
    if (!user || !portfolioId) return;
    
    const name = newAssetName.trim();
    const allocation = parseInt(newAssetAllocation);
    
    if (!name) {
      toast({
        title: "Nom invalide",
        description: "Veuillez entrer un nom d'actif valide.",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(allocation) || allocation <= 0 || allocation > 100) {
      toast({
        title: "Allocation invalide",
        description: "L'allocation doit être un nombre entre 1 et 100.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculer le total des allocations existantes
    const totalCurrentAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
    const totalAfterNewAsset = totalCurrentAllocation + allocation;
    
    if (totalAfterNewAsset > 100) {
      toast({
        title: "Allocation totale supérieure à 100%",
        description: `Le total des allocations ne peut pas dépasser 100%. Actuel: ${totalCurrentAllocation}%, Nouveau: ${allocation}%`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newAsset = {
        portfolio_id: portfolioId,
        name,
        allocation
      };
      
      const { data, error } = await supabase
        .from('asset_allocations')
        .insert([newAsset])
        .select();
      
      if (error) throw error;
      
      setAssets([...assets, { 
        id: data[0].id, 
        name: data[0].name, 
        allocation: data[0].allocation 
      }]);
      
      setNewAssetName('');
      setNewAssetAllocation('');
      setShowAssetForm(false);
      
      toast({
        title: "Actif ajouté",
        description: `${name} a été ajouté avec une allocation de ${allocation}%.`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'actif:', error);
      toast({
        title: "Erreur",
        description: "L'actif n'a pas pu être ajouté. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

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

  const deleteAsset = async (id: string) => {
    if (!user || !portfolioId) return;
    
    try {
      const { error } = await supabase
        .from('asset_allocations')
        .delete()
        .eq('id', id)
        .eq('portfolio_id', portfolioId);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      const updatedAssets = assets.filter(a => a.id !== id);
      setAssets(updatedAssets);
      
      // Redistribuer l'allocation si nécessaire
      if (updatedAssets.length > 0) {
        const totalAllocation = updatedAssets.reduce((sum, a) => sum + a.allocation, 0);
        
        if (totalAllocation < 100) {
          toast({
            title: "Actif supprimé",
            description: `L'allocation totale est maintenant de ${totalAllocation}%. Vous pouvez ajouter un nouvel actif.`,
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'actif:', error);
      toast({
        title: "Erreur",
        description: "L'actif n'a pas pu être supprimé. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Chargement de votre portefeuille...</span>
        </div>
      </AppLayout>
    );
  }

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

          <Card>
            <CardHeader>
              <CardTitle>Répartition des actifs</CardTitle>
              <CardDescription>
                Gérez la répartition de votre portefeuille par type d'actif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucun actif défini. Ajoutez votre première allocation d'actif.
                  </div>
                ) : (
                  assets.map(asset => (
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
                  ))
                )}

                {showAssetForm ? (
                  <div className="space-y-3 mt-4 p-3 border rounded-md">
                    <div className="space-y-2">
                      <Label htmlFor="assetName">Nom de l'actif</Label>
                      <Input
                        id="assetName"
                        placeholder="ex: Actions, Crypto, Forex..."
                        value={newAssetName}
                        onChange={(e) => setNewAssetName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assetAllocation">Allocation (%)</Label>
                      <Input
                        id="assetAllocation"
                        type="number"
                        placeholder="ex: 30"
                        value={newAssetAllocation}
                        onChange={(e) => setNewAssetAllocation(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowAssetForm(false)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        size="sm"
                        onClick={addAsset}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setShowAssetForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un actif
                  </Button>
                )}
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
      </div>
    </AppLayout>
  );
}
