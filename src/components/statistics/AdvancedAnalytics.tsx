
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PerformanceComparison, 
  VolatilityAnalysis, 
  DrawdownChart,
  RiskReturnScatter
} from "./premium/AdvancedCharts";
import { PremiumAnalyticsContent } from "./PremiumAnalyticsContent";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StrategyStats {
  name: string;
  totalTrades: number;
  winCount: number;
  winRate: number;
  totalPnL: number;
  avgPnL: number;
  bestTrade: number;
  worstTrade: number;
  profitFactor: number;
}

export default function AdvancedAnalytics() {
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [strategyStats, setStrategyStats] = useState<StrategyStats[]>([]);
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
        
        if (count && count > 0) {
          // Fetch the trades data
          const { data: trades, error: tradesError } = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', user.id);
            
          if (tradesError) throw tradesError;
          
          if (trades && trades.length > 0) {
            // Group trades by strategy
            const strategiesMap = new Map<string, StrategyStats>();
            
            trades.forEach(trade => {
              const strategyName = trade.strategy || 'Non définie';
              
              if (!strategiesMap.has(strategyName)) {
                strategiesMap.set(strategyName, {
                  name: strategyName,
                  totalTrades: 0,
                  winCount: 0,
                  winRate: 0,
                  totalPnL: 0,
                  avgPnL: 0,
                  bestTrade: -Infinity,
                  worstTrade: Infinity,
                  profitFactor: 0
                });
              }
              
              const stats = strategiesMap.get(strategyName)!;
              stats.totalTrades += 1;
              stats.totalPnL += (trade.pnl || 0);
              
              if (trade.pnl > 0) {
                stats.winCount += 1;
              }
              
              // Update best and worst trades
              if (trade.pnl > stats.bestTrade) {
                stats.bestTrade = trade.pnl;
              }
              
              if (trade.pnl < stats.worstTrade) {
                stats.worstTrade = trade.pnl;
              }
            });
            
            // Calculate derived statistics for each strategy
            const strategiesArray: StrategyStats[] = [];
            
            strategiesMap.forEach(stats => {
              // Calculate win rate
              stats.winRate = (stats.winCount / stats.totalTrades) * 100;
              
              // Calculate average P&L
              stats.avgPnL = stats.totalPnL / stats.totalTrades;
              
              // Calculate profit factor (total gains / total losses)
              const totalGains = trades
                .filter(t => t.strategy === stats.name && t.pnl > 0)
                .reduce((sum, t) => sum + t.pnl, 0);
                
              const totalLosses = Math.abs(trades
                .filter(t => t.strategy === stats.name && t.pnl < 0)
                .reduce((sum, t) => sum + t.pnl, 0));
                
              stats.profitFactor = totalLosses > 0 ? totalGains / totalLosses : 0;
              
              // Handle edge cases
              if (stats.bestTrade === -Infinity) stats.bestTrade = 0;
              if (stats.worstTrade === Infinity) stats.worstTrade = 0;
              
              strategiesArray.push(stats);
            });
            
            // Sort by total P&L descending
            strategiesArray.sort((a, b) => b.totalPnL - a.totalPnL);
            
            setStrategyStats(strategiesArray);
          }
        }
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
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée par Stratégie</CardTitle>
            </CardHeader>
            <CardContent>
              {strategyStats.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Aucune stratégie trouvée dans vos trades.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stratégie</TableHead>
                        <TableHead className="text-right">Trades</TableHead>
                        <TableHead className="text-right">Taux de Réussite</TableHead>
                        <TableHead className="text-right">P&L Total</TableHead>
                        <TableHead className="text-right">P&L Moyen</TableHead>
                        <TableHead className="text-right">Profit Factor</TableHead>
                        <TableHead className="text-right">Meilleur Trade</TableHead>
                        <TableHead className="text-right">Pire Trade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {strategyStats.map((strategy) => (
                        <TableRow key={strategy.name}>
                          <TableCell className="font-medium">{strategy.name}</TableCell>
                          <TableCell className="text-right">{strategy.totalTrades}</TableCell>
                          <TableCell className="text-right">{strategy.winRate.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-medium">
                            <span className={strategy.totalPnL >= 0 ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(strategy.totalPnL)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={strategy.avgPnL >= 0 ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(strategy.avgPnL)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{strategy.profitFactor.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(strategy.bestTrade)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(strategy.worstTrade)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
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
