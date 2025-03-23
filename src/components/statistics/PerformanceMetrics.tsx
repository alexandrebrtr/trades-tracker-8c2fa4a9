
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import PerformanceView from "./performance/PerformanceView";
import TradePerformanceTable from "./performance/TradePerformanceTable";
import TradeAnalysisChart from "./performance/TradeAnalysisChart";
import { ArrowUpRight, ArrowDownRight, Activity, BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { usePremium } from "@/context/PremiumContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PerformanceMetrics() {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedAnalysis, setSelectedAnalysis] = useState("general");
  
  const { 
    loading, 
    cumulativeReturnsData, 
    monthlyReturnsData, 
    volatilityData, 
    metrics 
  } = usePerformanceData(user, selectedPeriod);
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analyse des Performances</h2>
          <p className="text-muted-foreground">Mesures détaillées de vos performances de trading</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Dernier mois</SelectItem>
            <SelectItem value="quarter">Dernier trimestre</SelectItem>
            <SelectItem value="year">Dernière année</SelectItem>
            <SelectItem value="all">Toutes les données</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 w-full max-w-[600px]">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Vue générale</span>
          </TabsTrigger>
          <TabsTrigger value="trades" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analyse des trades</span>
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Analyse des stratégies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rendement Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(metrics.totalReturn)}
                  </p>
                  <div className={`flex items-center text-xs px-2 py-1 rounded-full ${metrics.totalReturn >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {metrics.totalReturn >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    <span>{Math.abs(metrics.annualizedReturn).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">{metrics.winRate.toFixed(1)}%</p>
                  <div className="relative w-12 h-2 bg-muted rounded-full">
                    <div 
                      className={`absolute top-0 left-0 h-2 rounded-full ${metrics.winRate > 50 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, metrics.winRate)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ratio de Sharpe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className={`text-2xl font-bold ${metrics.sharpeRatio >= 1 ? 'text-green-500' : metrics.sharpeRatio >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                    {metrics.sharpeRatio.toFixed(2)}
                  </p>
                  <div className="flex items-center text-xs">
                    <Activity className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">Rendement/Risque</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Drawdown Maximum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-red-500">-{metrics.maxDrawdown.toFixed(1)}%</p>
                  <div className="flex items-center text-xs">
                    <TrendingUp className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">Baisse maximale</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <PerformanceView 
            loading={loading}
            cumulativeReturnsData={cumulativeReturnsData}
            monthlyReturnsData={monthlyReturnsData}
            volatilityData={volatilityData}
            metrics={metrics}
          />
          
          {!isPremium && (
            <Card className="border-dashed border-primary/30 bg-secondary/5">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2">Débloquez des analyses avancées</h3>
                  <p className="text-muted-foreground max-w-lg">
                    Avec le mode Premium, accédez à des analyses de performance avancées, des métriques comparatives avec les indices de marché, et des analyses de risque détaillées.
                  </p>
                </div>
                <Button asChild size="lg" className="min-w-[150px]">
                  <Link to="/premium">Passer au Premium</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="trades" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance par type de trade</CardTitle>
                <CardDescription>Répartition des gains et pertes par direction de trade</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <TradeAnalysisChart type="type" userId={user?.id} period={selectedPeriod} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance par instrument</CardTitle>
                <CardDescription>Analyse des performances par actif négocié</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <TradeAnalysisChart type="symbol" userId={user?.id} period={selectedPeriod} />
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Analyse détaillée des trades</span>
              </CardTitle>
              <CardDescription>Analyse complète de vos trades sur la période sélectionnée</CardDescription>
            </CardHeader>
            <CardContent>
              <TradePerformanceTable userId={user?.id} period={selectedPeriod} />
            </CardContent>
          </Card>
          
          {!isPremium && (
            <Card className="border-dashed border-primary/30 bg-secondary/5">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2">Accédez à des analyses comportementales avancées</h3>
                  <p className="text-muted-foreground max-w-lg">
                    Le mode Premium vous permet d'identifier vos biais comportementaux, d'analyser votre performance selon l'heure et le jour de trading, et bien plus encore.
                  </p>
                </div>
                <Button asChild size="lg" className="min-w-[150px]">
                  <Link to="/premium">Passer au Premium</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="strategies" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des stratégies</CardTitle>
              <CardDescription>Comparaison des performances par stratégie de trading</CardDescription>
            </CardHeader>
            <CardContent>
              <TradeAnalysisChart type="strategy" userId={user?.id} period={selectedPeriod} showAsBar={true} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques par stratégie</CardTitle>
                <CardDescription>Métriques détaillées pour chaque stratégie</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Trend Following</h4>
                      <span className="text-green-500 font-medium">+21.4%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="font-medium">76.2%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit Factor</p>
                        <p className="font-medium">2.1</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trades</p>
                        <p className="font-medium">42</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Breakout</h4>
                      <span className="text-green-500 font-medium">+15.8%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="font-medium">64.7%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit Factor</p>
                        <p className="font-medium">1.7</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trades</p>
                        <p className="font-medium">27</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Mean Reversion</h4>
                      <span className="text-red-500 font-medium">-4.2%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="font-medium">42.3%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit Factor</p>
                        <p className="font-medium">0.8</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trades</p>
                        <p className="font-medium">19</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
                <CardDescription>Suggestions basées sur vos performances</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-medium mb-1">Renforcer stratégie Trend Following</h4>
                    <p className="text-sm text-muted-foreground">
                      Cette stratégie montre un Win Rate de 76.2% et un Profit Factor de 2.1. Augmenter l'allocation sur cette approche pourrait améliorer vos performances globales.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-amber-500 pl-4 py-2">
                    <h4 className="font-medium mb-1">Réévaluer timeframes sur Breakout</h4>
                    <p className="text-sm text-muted-foreground">
                      Les trades sur breakouts montrent de meilleurs résultats sur des timeframes plus longs (4H+). Envisager d'adapter votre approche pour cette stratégie.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h4 className="font-medium mb-1">Limiter Mean Reversion</h4>
                    <p className="text-sm text-muted-foreground">
                      Cette stratégie présente un Profit Factor inférieur à 1. Considérez de réduire l'allocation ou d'affiner les critères d'entrée pour améliorer les résultats.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {!isPremium && (
            <Card className="border-dashed border-primary/30 bg-secondary/5">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2">Optimisez vos stratégies avec l'IA</h3>
                  <p className="text-muted-foreground max-w-lg">
                    Le mode Premium vous donne accès à des recommandations d'optimisation basées sur l'IA, des backtests avancés et des analyses prédictives pour affiner vos stratégies.
                  </p>
                </div>
                <Button asChild size="lg" className="min-w-[150px]">
                  <Link to="/premium">Passer au Premium</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
