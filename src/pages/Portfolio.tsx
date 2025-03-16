
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CapitalManagement } from '@/components/portfolio/CapitalManagement';
import { AssetAllocation } from '@/components/portfolio/AssetAllocation';
import { TradesHistory } from '@/components/portfolio/TradesHistory';

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
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [portfolioSize, setPortfolioSize] = useState(0);
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolioData();
  }, [user]);

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
