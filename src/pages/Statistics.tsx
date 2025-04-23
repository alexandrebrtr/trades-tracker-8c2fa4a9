
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Wallet, Lock, Database } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GeneralView from '@/components/statistics/GeneralView';
import StrategyAnalysis from '@/components/statistics/StrategyAnalysis';
import CustomCharts from '@/components/statistics/CustomCharts';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTradesFetcher } from '@/hooks/useTradesFetcher';
import { useIsMobile } from '@/hooks/use-mobile';

const NoDataView = ({ tabName }: { tabName: string }) => {
  return (
    <Card className="py-8 md:py-16">
      <CardContent className="flex flex-col items-center justify-center">
        <Database className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/50 mb-3 md:mb-4" />
        <CardTitle className="text-lg md:text-xl mb-2 text-center">Aucune donnée disponible</CardTitle>
        <p className="text-muted-foreground text-center max-w-md mb-4 md:mb-6 text-sm md:text-base px-2">
          Vous n'avez pas encore de trades ou d'informations pour {tabName.toLowerCase()}. 
          Commencez par ajouter des trades dans votre portefeuille pour voir apparaitre des statistiques.
        </p>
        <Button asChild size="sm" className="w-full md:w-auto">
          <Link to="/portfolio">Ajouter des trades</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const Statistics = () => {
  const { isPremium } = usePremium();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('general');
  const isMobile = useIsMobile();

  // Récupérer les trades pour vérifier si l'utilisateur a des données
  const { isLoading, trades } = useTradesFetcher(user?.id, 'all');
  const hasData = trades.length > 0;

  useEffect(() => {
    // Extract tab from URL if present
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['general', 'strategy', 'advanced'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/statistics?tab=${value}`, { replace: true });
    
    if (value === 'advanced' && !isPremium) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs premium', {
        description: 'Passez au mode premium pour accéder à toutes les fonctionnalités.'
      });
    }
  };

  return (
    <AppLayout>
      <div className="page-transition">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 md:mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Statistiques & Analyse</h1>
          </div>
          <div className="flex gap-2 md:gap-4">
            <Button variant="outline" asChild size={isMobile ? "sm" : "default"} className="w-full md:w-auto">
              <Link to="/portfolio" className="flex items-center gap-1 md:gap-2">
                <Wallet className="h-4 w-4" />
                <span>{isMobile ? "Portefeuille" : "Gérer le portefeuille"}</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className={`grid ${isMobile ? "grid-cols-3 gap-1 mb-4" : "grid-cols-3 mb-8"} w-full`}>
            <TabsTrigger value="general" className="text-xs md:text-sm">Vue Générale</TabsTrigger>
            <TabsTrigger value="strategy" className="text-xs md:text-sm">Analyse Stratégique</TabsTrigger>
            <TabsTrigger value="advanced" disabled={!isPremium} className="text-xs md:text-sm relative">
              Analyses Avancées
              {!isPremium && (
                <Lock className="h-3 w-3 ml-1 text-yellow-500" />
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4 md:mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-16 md:py-24">
                <div className="animate-spin h-6 w-6 md:h-8 md:w-8 border-4 border-primary border-r-transparent rounded-full"></div>
              </div>
            ) : hasData ? (
              <GeneralView trades={trades} />
            ) : (
              <NoDataView tabName="la vue générale" />
            )}
          </TabsContent>
          
          <TabsContent value="strategy" className="mt-4 md:mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-16 md:py-24">
                <div className="animate-spin h-6 w-6 md:h-8 md:w-8 border-4 border-primary border-r-transparent rounded-full"></div>
              </div>
            ) : hasData ? (
              <StrategyAnalysis />
            ) : (
              <NoDataView tabName="l'analyse des stratégies" />
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-4 md:mt-6">
            {isPremium ? (
              isLoading ? (
                <div className="flex justify-center items-center py-16 md:py-24">
                  <div className="animate-spin h-6 w-6 md:h-8 md:w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                </div>
              ) : hasData ? (
                <CustomCharts userId={user?.id} />
              ) : (
                <NoDataView tabName="les analyses avancées" />
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-8 md:py-12 px-4 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <Lock className="h-8 w-8 md:h-12 md:w-12 text-yellow-500 mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-center">Fonctionnalité Premium</h3>
                <p className="text-muted-foreground text-center mb-4 md:mb-6 max-w-md text-sm md:text-base">
                  L'analyse avancée est réservée aux utilisateurs premium. Passez à l'offre premium pour accéder à des métriques et analyses approfondies.
                </p>
                <Button asChild size={isMobile ? "sm" : "default"} className="w-full md:w-auto">
                  <Link to="/premium">Passer au Premium</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Statistics;
