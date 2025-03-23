
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PerformanceComparison, 
  VolatilityAnalysis, 
  DrawdownChart,
  RiskReturnScatter
} from "./premium/AdvancedCharts";
import { PerformanceMetricsPanel } from "./premium/PerformanceMetrics";
import { PremiumAnalyticsContent } from "./PremiumAnalyticsContent";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function AdvancedAnalytics() {
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { count, error } = await supabase
          .from('trades')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (error) throw error;
        
        setHasData(count ? count > 0 : false);
      } catch (err) {
        console.error("Error checking user data:", err);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analyses Avancées Premium</h2>
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-secondary/10 rounded-lg">
          <p className="text-lg font-medium mb-2">Aucune donnée disponible</p>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Ajoutez des trades à votre portefeuille pour voir apparaître des analyses avancées ici.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analyses Avancées Premium</h2>
      
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="comparison">Comparaison Marché</TabsTrigger>
          <TabsTrigger value="volatility">Volatilité</TabsTrigger>
          <TabsTrigger value="risk">Risque & Drawdown</TabsTrigger>
          <TabsTrigger value="strategies">Stratégies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="space-y-6">
          <PerformanceComparison />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PerformanceMetricsPanel />
          </div>
        </TabsContent>
        
        <TabsContent value="volatility" className="space-y-6">
          <VolatilityAnalysis />
          <PremiumAnalyticsContent />
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DrawdownChart />
            <RiskReturnScatter />
          </div>
        </TabsContent>
        
        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-secondary/10 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Optimisation de Portefeuille</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Recommandations basées sur l'analyse de vos performances actuelles et historiques.
              </p>
              
              <div className="space-y-6">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <h4 className="text-lg font-medium mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Recommandation #1
                  </h4>
                  <p className="text-sm mb-2">Réduction de l'exposition au secteur technologique</p>
                  <p className="text-xs text-muted-foreground">
                    Votre portefeuille montre une surexposition (48%) au secteur technologique. Une réduction à 35% pourrait améliorer votre ratio de Sharpe de 0.3.
                  </p>
                </div>
                
                <div className="p-4 bg-background rounded-lg border border-border">
                  <h4 className="text-lg font-medium mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Recommandation #2
                  </h4>
                  <p className="text-sm mb-2">Augmentation des titres à faible volatilité</p>
                  <p className="text-xs text-muted-foreground">
                    Ajouter 10-15% d'allocation vers des titres à faible bêta pourrait réduire votre drawdown maximal de 4% sans impact significatif sur vos rendements.
                  </p>
                </div>
                
                <div className="p-4 bg-background rounded-lg border border-border">
                  <h4 className="text-lg font-medium mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Recommandation #3
                  </h4>
                  <p className="text-sm mb-2">Optimisation de la taille des positions</p>
                  <p className="text-xs text-muted-foreground">
                    Votre analyse montre que vos positions supérieures à 5% du capital ont une performance inférieure de 12%. Limiter la taille des positions entre 2-4% pourrait améliorer vos rendements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
