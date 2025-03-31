import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DailyPnLChart,
  DrawdownChart,
  RiskReturnScatter
} from "./premium/AdvancedCharts";
import { PremiumAnalyticsContent } from "./PremiumAnalyticsContent";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Zap } from "lucide-react";

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
          const { data: trades, error: tradesError } = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', user.id);
            
          if (tradesError) throw tradesError;
          
          if (trades && trades.length > 0) {
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
              
              if (trade.pnl > stats.bestTrade) {
                stats.bestTrade = trade.pnl;
              }
              
              if (trade.pnl < stats.worstTrade) {
                stats.worstTrade = trade.pnl;
              }
            });
            
            const strategiesArray: StrategyStats[] = [];
            
            strategiesMap.forEach(stats => {
              stats.winRate = (stats.winCount / stats.totalTrades) * 100;
              stats.avgPnL = stats.totalPnL / stats.totalTrades;
              
              const totalGains = trades
                .filter(t => t.strategy === stats.name && t.pnl > 0)
                .reduce((sum, t) => sum + t.pnl, 0);
                
              const totalLosses = Math.abs(trades
                .filter(t => t.strategy === stats.name && t.pnl < 0)
                .reduce((sum, t) => sum + t.pnl, 0));
                
              stats.profitFactor = totalLosses > 0 ? totalGains / totalLosses : 0;
              
              if (stats.bestTrade === -Infinity) stats.bestTrade = 0;
              if (stats.worstTrade === Infinity) stats.worstTrade = 0;
              
              strategiesArray.push(stats);
            });
            
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
      
      <Tabs defaultValue="volatility" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="volatility">P&L Journalier</TabsTrigger>
          <TabsTrigger value="risk">Risque & Drawdown</TabsTrigger>
          <TabsTrigger value="strategies">Stratégies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="volatility" className="space-y-6">
          <DailyPnLChart />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {strategyStats.map((strategy) => (
                    <Card key={strategy.name} className="border border-border overflow-hidden">
                      <CardHeader className="bg-secondary/10 pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            {strategy.name}
                          </CardTitle>
                          <Badge 
                            variant={strategy.winRate >= 50 ? "default" : "destructive"} 
                            className="text-md px-3 py-1"
                          >
                            {strategy.winRate.toFixed(1)}% taux de réussite
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary/10 p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground">Nombre de trades</p>
                              <p className="text-lg font-semibold">{strategy.totalTrades}</p>
                            </div>
                            <div className="bg-secondary/10 p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground">Profit Factor</p>
                              <p className={`text-lg font-semibold ${strategy.profitFactor >= 1 ? 'text-green-500' : 'text-red-500'}`}>
                                {strategy.profitFactor.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary/10 p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground">P&L Total</p>
                              <p className={`text-lg font-semibold ${strategy.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatCurrency(strategy.totalPnL)}
                              </p>
                            </div>
                            <div className="bg-secondary/10 p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground">P&L Moyen</p>
                              <p className={`text-lg font-semibold ${strategy.avgPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatCurrency(strategy.avgPnL)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col p-3 rounded-lg border border-border">
                              <div className="flex items-center gap-2 mb-1">
                                <ArrowUp className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Meilleur Trade</span>
                              </div>
                              <span className="text-lg font-semibold text-green-500">
                                {formatCurrency(strategy.bestTrade)}
                              </span>
                            </div>
                            
                            <div className="flex flex-col p-3 rounded-lg border border-border">
                              <div className="flex items-center gap-2 mb-1">
                                <ArrowDown className="h-4 w-4 text-red-500" />
                                <span className="text-sm">Pire Trade</span>
                              </div>
                              <span className="text-lg font-semibold text-red-500">
                                {formatCurrency(strategy.worstTrade)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
