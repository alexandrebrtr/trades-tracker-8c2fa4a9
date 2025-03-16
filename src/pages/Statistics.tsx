
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Wallet, Lock } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AnalyticsView from '@/components/statistics/AnalyticsView';
import StrategyAnalysis from '@/components/statistics/StrategyAnalysis';
import PerformanceMetrics from '@/components/statistics/PerformanceMetrics';
import AdvancedAnalytics from '@/components/statistics/AdvancedAnalytics';
import { toast } from 'sonner';

const Statistics = () => {
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('general');

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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Statistiques & Analyse</h1>
          </div>
          <div className="flex gap-4">
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
          
          <TabsContent value="general" className="mt-6">
            <AnalyticsView />
          </TabsContent>
          
          <TabsContent value="strategy" className="mt-6">
            <StrategyAnalysis />
          </TabsContent>
          
          <TabsContent value="performance" className="mt-6">
            <PerformanceMetrics />
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-6">
            {isPremium ? (
              <AdvancedAnalytics />
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
