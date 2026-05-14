import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Loader2, CalendarIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CapitalManagement } from '@/components/portfolio/CapitalManagement';
import { AssetAllocation } from '@/components/portfolio/AssetAllocation';
import { TradesHistory } from '@/components/portfolio/TradesHistory';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAccount } from '@/context/AccountContext';

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
  const { user, isLoading: authLoading } = useAuth();
  const { activeAccount, activeAccountId } = useAccount();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [portfolioSize, setPortfolioSize] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [initialSetupDone, setInitialSetupDone] = useState(false);
  const [initialBalance, setInitialBalance] = useState('');
  const [initialDate, setInitialDate] = useState<Date>(new Date());

  // Charger les données du portfolio de l'utilisateur seulement si l'utilisateur est connecté
  useEffect(() => {
    // Attendre que l'état d'authentification soit chargé
    if (authLoading) return;
    
    if (!user) {
      // Si l'utilisateur n'est pas connecté, on ne charge pas les données
      setIsLoading(false);
      return;
    }
    
    const fetchPortfolioData = async () => {
      console.log("Fetching portfolio data for user:", user.id);
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
          currentPortfolioId = newPortfolio.id;
        } else {
          currentPortfolioId = portfolios[0].id;
        }

        // Détermine l'état initial à partir des transactions (source de vérité)
        const { count: txCount } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Récupère le solde réel depuis profiles (mis à jour par les triggers)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .maybeSingle();

        const realBalance = Number(profileData?.balance ?? 0);
        setPortfolioSize(realBalance);
        setInitialSetupDone((txCount ?? 0) > 0);
        
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
        
        if (tradesData) {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();

    // Realtime: garder le solde synchronisé partout
    if (user) {
      const channel = supabase
        .channel('portfolio-page-balance')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload: any) => {
            if (payload.new && 'balance' in payload.new) {
              setPortfolioSize(Number(payload.new.balance));
            }
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, authLoading]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const handleInitialBalanceSubmit = async () => {
    if (!user || !portfolioId) return;

    const amount = parseFloat(initialBalance);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide supérieur à 0.",
        variant: "destructive",
      });
      return;
    }
    if (!initialDate) {
      toast({ title: "Date requise", description: "Sélectionnez la date du dépôt initial.", variant: "destructive" });
      return;
    }

    try {
      // Premier dépôt enregistré comme transaction (les triggers mettent à jour le solde)
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount,
          date: initialDate.toISOString(),
          notes: 'Dépôt initial',
        });

      if (txError) throw txError;

      setInitialSetupDone(true);

      toast({
        title: "Dépôt initial enregistré",
        description: `Capital de départ : ${formatCurrency(amount)}`,
      });
    } catch (error: any) {
      console.error('Erreur lors de la configuration de la balance:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <span className="text-muted-foreground">Chargement de votre portefeuille...</span>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-2xl font-bold mb-4">Veuillez vous connecter</h2>
          <p className="text-muted-foreground mb-4">Vous devez être connecté pour accéder à votre portefeuille.</p>
          <Button asChild>
            <a href="/login">Se connecter</a>
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (!initialSetupDone) {
    return (
      <AppLayout>
        <div className="page-transition space-y-8">
          <h1 className="text-3xl font-bold tracking-tight">Configuration du portefeuille</h1>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Bienvenue !</CardTitle>
              <CardDescription>
                Enregistrez votre premier dépôt pour démarrer le suivi de votre capital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initial-balance">Montant du dépôt initial (€)</Label>
                <Input
                  id="initial-balance"
                  type="number"
                  placeholder="Ex: 10000"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date du dépôt</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !initialDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {initialDate ? format(initialDate, 'PPP', { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={initialDate}
                      onSelect={(d) => d && setInitialDate(d)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                className="w-full"
                onClick={handleInitialBalanceSubmit}
                disabled={!initialBalance || parseFloat(initialBalance) <= 0}
              >
                Commencer
              </Button>
            </CardContent>
          </Card>
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
          <CapitalManagement 
            portfolioId={portfolioId}
            portfolioSize={portfolioSize}
            setPortfolioSize={setPortfolioSize}
            trades={trades}
            formatCurrency={formatCurrency}
          />

          <AssetAllocation 
            portfolioId={portfolioId}
            assets={assets}
            setAssets={setAssets}
          />
        </div>

        <TradesHistory 
          trades={trades}
          setTrades={setTrades}
        />
      </div>
    </AppLayout>
  );
}
