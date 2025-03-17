
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PerformanceComparison, 
  VolatilityAnalysis, 
  DrawdownChart,
  RiskReturnScatter
} from "./premium/AdvancedCharts";
import { PerformanceMetricsPanel } from "./premium/PerformanceMetrics";
import { PremiumAnalyticsContent } from "./PremiumAnalyticsContent";

export default function AdvancedAnalytics() {
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
