
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, TrendingUp, AlertTriangle, BarChart2, 
  BarChart3, LineChart, PieChart, Clock, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AdvancedAnalytics() {
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("comparison");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">PREMIUM</Badge>
              <span>Analyses Avancées</span>
            </h2>
            <p className="text-muted-foreground">Analyses approfondies et comparaisons de marché</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/premium-dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Dashboard Premium</span>
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-secondary/10 rounded-lg">
          <Activity className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-lg font-medium mb-2">Aucune donnée disponible</p>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Ajoutez des trades à votre portefeuille pour voir apparaître des analyses avancées ici. Ces analyses vous permettront d'optimiser vos stratégies et d'améliorer vos performances.
          </p>
          <Button asChild>
            <Link to="/portfolio">Ajouter des trades</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">PREMIUM</Badge>
            <span>Analyses Avancées</span>
          </h2>
          <p className="text-muted-foreground">Analyses approfondies et comparaisons de marché</p>
        </div>
        <div className="flex items-center gap-3">
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
          
          <Button asChild variant="outline">
            <Link to="/premium-dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Dashboard Premium</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Comparaison Marché</span>
          </TabsTrigger>
          <TabsTrigger value="volatility" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Volatilité</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Risque & Drawdown</span>
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Stratégies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="space-y-6">
          <PerformanceComparison />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PerformanceMetricsPanel />
            
            <Card>
              <CardHeader>
                <CardTitle>Compétitivité du portefeuille</CardTitle>
                <CardDescription>Comparaison avec les indices et gestionnaires de fonds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm font-medium">Comparé à S&P 500</span>
                      <span className="text-sm font-medium text-green-500">+12.4%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vous surperformez le S&P 500 de 12.4% sur la période sélectionnée
                    </p>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm font-medium">Comparé au NASDAQ</span>
                      <span className="text-sm font-medium text-green-500">+3.8%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '53.8%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vous surperformez le NASDAQ de 3.8% sur la période sélectionnée
                    </p>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm font-medium">Comparé aux hedge funds (HFRI)</span>
                      <span className="text-sm font-medium text-green-500">+18.2%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '68.2%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vous surperformez l'indice des hedge funds de 18.2% sur la période sélectionnée
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Rang parmi les investisseurs particuliers</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 hover:bg-green-600">Top 15%</Badge>
                      <span className="text-xs text-muted-foreground">
                        Vous êtes dans le top 15% des traders particuliers sur cette plateforme
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="volatility" className="space-y-6">
          <VolatilityAnalysis />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des rendements</CardTitle>
                <CardDescription>Analyse statistique de la distribution de vos rendements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-full">
                  <div className="h-[200px] flex items-end justify-between px-2">
                    {Array.from({ length: 15 }).map((_, i) => {
                      const height = [10, 15, 25, 35, 55, 75, 90, 70, 50, 30, 20, 15, 10, 5, 2][i];
                      const color = i < 6 ? 'bg-red-500/80' : i === 6 ? 'bg-amber-500/80' : 'bg-green-500/80';
                      return (
                        <div key={i} className="w-4 flex flex-col items-center">
                          <div className={`${color} rounded-t-sm w-full`} style={{ height: `${height}%` }}></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">-5%</span>
                    <span className="text-xs text-muted-foreground">0%</span>
                    <span className="text-xs text-muted-foreground">+5%</span>
                  </div>
                  <div className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Moyenne</p>
                        <p className="font-medium">+0.87%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Écart-type</p>
                        <p className="font-medium">1.84%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Skewness</p>
                        <p className="font-medium">0.32</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Kurtosis</p>
                        <p className="font-medium">2.76</p>
                      </div>
                    </div>
                    <div className="pt-2 text-xs text-muted-foreground">
                      <p>
                        Votre distribution présente un léger biais positif (skewness = 0.32), indiquant une tendance à avoir plus de gains extrêmes que de pertes extrêmes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dispersion temporelle de la volatilité</CardTitle>
                <CardDescription>Analyse des périodes de haute et basse volatilité</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-full">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Volatilité par jour de la semaine</h4>
                      <div className="space-y-2">
                        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((day, i) => {
                          const values = [2.1, 1.4, 1.8, 2.4, 1.9];
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-20 text-sm">{day}</div>
                              <div className="w-full bg-secondary h-2 rounded-full">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${(values[i] / Math.max(...values)) * 100}%` }}
                                ></div>
                              </div>
                              <div className="w-14 text-sm text-right">{values[i]}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h4 className="text-sm font-medium mb-2">Volatilité par heure de trading</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-xs text-muted-foreground mb-1">Heures de forte volatilité</h5>
                          <ul className="text-sm space-y-1">
                            <li className="flex justify-between">
                              <span>14:30 - 16:00</span>
                              <span className="font-medium">2.7%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>9:30 - 10:30</span>
                              <span className="font-medium">2.3%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>15:45 - 16:15</span>
                              <span className="font-medium">2.1%</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-xs text-muted-foreground mb-1">Heures de faible volatilité</h5>
                          <ul className="text-sm space-y-1">
                            <li className="flex justify-between">
                              <span>12:00 - 13:30</span>
                              <span className="font-medium">0.8%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>11:00 - 12:00</span>
                              <span className="font-medium">1.1%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>16:30 - 17:30</span>
                              <span className="font-medium">1.2%</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 pb-2">
                      <h4 className="text-sm font-medium mb-1">Recommandation</h4>
                      <p className="text-xs text-muted-foreground">
                        Vos meilleures performances sont observées durant les périodes de volatilité moyenne (1.5-2.0%). 
                        Considérez adapter votre activité de trading aux périodes de volatilité optimale pour votre stratégie.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DrawdownChart />
            <RiskReturnScatter />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Analyse détaillée des risques</CardTitle>
              <CardDescription>Évaluation complète de votre exposition au risque</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Métriques de risque clés</h3>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Value at Risk (95%)</p>
                        <p className="text-sm font-medium">-1.82%</p>
                        <p className="text-xs text-muted-foreground">journalier</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Value at Risk (99%)</p>
                        <p className="text-sm font-medium">-3.14%</p>
                        <p className="text-xs text-muted-foreground">journalier</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expected Shortfall</p>
                        <p className="text-sm font-medium">-2.43%</p>
                        <p className="text-xs text-muted-foreground">moyenne des pertes</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ratio de Sortino</p>
                        <p className="text-sm font-medium">1.67</p>
                        <p className="text-xs text-muted-foreground">rendement/risque baissier</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Distribution des pertes</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Pertes &lt; 1%</span>
                        <div className="w-2/4 mx-2 bg-secondary/50 rounded-full h-2">
                          <div className="bg-blue-500/70 h-2 rounded-full" style={{ width: "68%" }}></div>
                        </div>
                        <span className="text-xs">68.4%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Pertes 1-2%</span>
                        <div className="w-2/4 mx-2 bg-secondary/50 rounded-full h-2">
                          <div className="bg-blue-500/70 h-2 rounded-full" style={{ width: "23%" }}></div>
                        </div>
                        <span className="text-xs">22.7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Pertes 2-5%</span>
                        <div className="w-2/4 mx-2 bg-secondary/50 rounded-full h-2">
                          <div className="bg-blue-500/70 h-2 rounded-full" style={{ width: "7%" }}></div>
                        </div>
                        <span className="text-xs">7.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Pertes &gt; 5%</span>
                        <div className="w-2/4 mx-2 bg-secondary/50 rounded-full h-2">
                          <div className="bg-blue-500/70 h-2 rounded-full" style={{ width: "1.7%" }}></div>
                        </div>
                        <span className="text-xs">1.7%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Gestion du risque</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-secondary/20 rounded-md">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                            Forces
                          </Badge>
                        </h4>
                        <ul className="mt-2 space-y-1 text-xs">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 text-lg leading-none">•</span>
                            <span>Cohérence dans l'application des stop-loss</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 text-lg leading-none">•</span>
                            <span>Faible fréquence de drawdowns majeurs (&gt;10%)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 text-lg leading-none">•</span>
                            <span>Bon ratio risque/rendement sur 75% des trades</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-secondary/20 rounded-md">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
                            Améliorations
                          </Badge>
                        </h4>
                        <ul className="mt-2 space-y-1 text-xs">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 text-lg leading-none">•</span>
                            <span>Tendance à augmenter la taille des positions après pertes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 text-lg leading-none">•</span>
                            <span>Concentration excessive sur certains actifs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 text-lg leading-none">•</span>
                            <span>Inconsistance dans la gestion des positions gagnantes</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-primary/30 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Recommandation personnalisée</h3>
                    <p className="text-xs text-muted-foreground">
                      Basé sur votre profil de risque, envisagez de limiter chaque position à max 5% du capital. 
                      Cela réduirait votre drawdown maximum estimé de 15.2% à environ 9.7% tout en maintenant un rendement annualisé similaire.
                    </p>
                    <div className="mt-3 text-xs">
                      <span className="text-primary font-medium">Simulation :</span>
                      <div className="flex justify-between mt-1">
                        <span>Drawdown actuel: -15.2%</span>
                        <span>Optimisé: -9.7%</span>
                      </div>
                      <div className="w-full bg-secondary h-1.5 rounded-full mt-1">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: "63%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-secondary/10 p-6 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium">Optimisation de Portefeuille</h3>
                  <p className="text-sm text-muted-foreground">
                    Recommandations basées sur l'analyse de vos performances actuelles et historiques
                  </p>
                </div>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Intelligence Artificielle</Badge>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <h4 className="text-lg font-medium mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span>Diversification sectorielle</span>
                  </h4>
                  <p className="text-sm mb-2">Réduction de l'exposition au secteur technologique</p>
                  <p className="text-xs text-muted-foreground">
                    Votre portefeuille montre une surexposition (48%) au secteur technologique. Une réduction à 35% pourrait améliorer votre ratio de Sharpe de 0.3 et réduire le drawdown maximal de 3.2%.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 grid grid-cols-5 gap-1 h-2">
                      <div className="bg-blue-500 h-2 rounded-l-full"></div>
                      <div className="bg-amber-500 h-2"></div>
                      <div className="bg-green-500 h-2"></div>
                      <div className="bg-purple-500 h-2"></div>
                      <div className="bg-red-500 h-2 rounded-r-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">Bénéfice estimé: +12%</span>
                  </div>
                </div>
                
                <div className="p-4 bg-background rounded-lg border border-border">
                  <h4 className="text-lg font-medium mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span>Optimisation de la taille des positions</span>
                  </h4>
                  <p className="text-sm mb-2">Redimensionnement des positions existantes</p>
                  <p className="text-xs text-muted-foreground">
                    L'analyse des performances montre que vos positions de taille moyenne (3-4% du capital) ont un meilleur rapport rendement/risque que les positions plus importantes. Limiter la taille maximale à 5% du capital améliorerait les performances ajustées au risque d'environ 8%.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 grid grid-cols-5 gap-1 h-2">
                      <div className="bg-blue-500 h-2 rounded-l-full"></div>
                      <div className="bg-amber-500 h-2"></div>
                      <div className="bg-green-500 h-2"></div>
                      <div className="bg-purple-500 h-2"></div>
                      <div className="bg-red-500 h-2 rounded-r-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">Bénéfice estimé: +8%</span>
                  </div>
                </div>
                
                <div className="p-4 bg-background rounded-lg border border-border">
                  <h4 className="text-lg font-medium mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span>Ajustement des stratégies</span>
                  </h4>
                  <p className="text-sm mb-2">Renforcement des stratégies les plus efficaces</p>
                  <p className="text-xs text-muted-foreground">
                    Les données montrent que votre stratégie "Momentum" génère un ROI moyen de 2.8x supérieur à votre stratégie "Reversion à la moyenne", avec une volatilité seulement 1.2x plus élevée. En augmentant l'allocation à cette stratégie de 25% à 40%, vous pourriez améliorer le rendement annualisé de 4.7%.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 grid grid-cols-5 gap-1 h-2">
                      <div className="bg-blue-500 h-2 rounded-l-full"></div>
                      <div className="bg-amber-500 h-2"></div>
                      <div className="bg-green-500 h-2"></div>
                      <div className="bg-purple-500 h-2"></div>
                      <div className="bg-red-500 h-2 rounded-r-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">Bénéfice estimé: +15%</span>
                  </div>
                </div>
                
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Timeframes optimales</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs text-muted-foreground mb-1">Stratégies momentum</h5>
                        <div className="space-y-2 text-sm mt-2">
                          <div className="flex justify-between items-center">
                            <span>Journalier (D1)</span>
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">+67% win rate</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>4 heures (H4)</span>
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">+58% win rate</Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs text-muted-foreground mb-1">Stratégies breakout</h5>
                        <div className="space-y-2 text-sm mt-2">
                          <div className="flex justify-between items-center">
                            <span>Hebdomadaire (W1)</span>
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">+72% win rate</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Journalier (D1)</span>
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">+63% win rate</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
