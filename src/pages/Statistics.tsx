
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Wallet, Lock, Database, ArrowRight } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AnalyticsView from '@/components/statistics/AnalyticsView';
import StrategyAnalysis from '@/components/statistics/StrategyAnalysis';
import PerformanceMetrics from '@/components/statistics/PerformanceMetrics';
import AdvancedAnalytics from '@/components/statistics/AdvancedAnalytics';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTradesFetcher } from '@/hooks/useTradesFetcher';
import { Badge } from '@/components/ui/badge';

const NoDataView = ({ tabName }: { tabName: string }) => {
  return (
    <Card className="py-16">
      <CardContent className="flex flex-col items-center justify-center">
        <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <CardTitle className="text-xl mb-2">Aucune donnée disponible</CardTitle>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Vous n'avez pas encore de trades ou d'informations pour {tabName.toLowerCase()}. 
          Commencez par ajouter des trades dans votre portefeuille pour voir apparaitre des statistiques.
        </p>
        <Button asChild>
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

  // Récupérer les trades pour vérifier si l'utilisateur a des données
  const { isLoading, trades } = useTradesFetcher(user?.id, 'all');
  const hasData = trades.length > 0;

  useEffect(() => {
    // Extract tab from URL if present
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['general', 'strategy', 'performance', 'advanced'].includes(tab)) {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Statistiques & Analyse</h1>
            <p className="text-muted-foreground mt-1">Analysez vos performances et optimisez vos stratégies</p>
          </div>
          <div className="flex gap-4">
            {isPremium ? (
              <Button asChild>
                <Link to="/premium-dashboard" className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/20 text-primary hover:bg-primary/30 mr-1">PREMIUM</Badge>
                  <span>Dashboard Avancé</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/premium" className="flex items-center gap-2">
                  <span>Passer au Premium</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/portfolio" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>Gérer le portefeuille</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="general">Vue Générale</TabsTrigger>
            <TabsTrigger value="strategy">Analyse Stratégies</TabsTrigger>
            <TabsTrigger value="performance">Métriques Performance</TabsTrigger>
            <TabsTrigger value="advanced" disabled={!isPremium} className="relative">
              Analyses Avancées
              {!isPremium && (
                <Lock className="h-3 w-3 ml-1 text-yellow-500" />
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6 animate-fade-in">
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
              </div>
            ) : hasData ? (
              <AnalyticsView />
            ) : (
              <NoDataView tabName="la vue générale" />
            )}
          </TabsContent>
          
          <TabsContent value="strategy" className="mt-6 animate-fade-in">
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
              </div>
            ) : hasData ? (
              <StrategyAnalysis />
            ) : (
              <NoDataView tabName="l'analyse des stratégies" />
            )}
          </TabsContent>
          
          <TabsContent value="performance" className="mt-6 animate-fade-in">
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
              </div>
            ) : hasData ? (
              <PerformanceMetrics />
            ) : (
              <NoDataView tabName="les métriques de performance" />
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-6 animate-fade-in">
            {isPremium ? (
              isLoading ? (
                <div className="flex justify-center items-center py-24">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                </div>
              ) : hasData ? (
                <AdvancedAnalytics />
              ) : (
                <NoDataView tabName="les analyses avancées" />
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <Lock className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fonctionnalité Premium</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  L'analyse avancée est réservée aux utilisateurs premium. Passez à l'offre premium pour accéder à des métriques et analyses approfondies.
                </p>
                <Button asChild>
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
