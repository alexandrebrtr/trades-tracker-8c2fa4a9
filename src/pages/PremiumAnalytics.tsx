
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { usePerformanceData } from '@/hooks/usePerformanceData';
import { 
  PerformanceComparison, 
  VolatilityAnalysis, 
  DrawdownChart,
  RiskReturnScatter
} from '@/components/statistics/premium/AdvancedCharts';

export default function PremiumAnalytics() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedView, setSelectedView] = useState("performance");
  
  const { 
    loading, 
    cumulativeReturnsData, 
    monthlyReturnsData, 
    volatilityData, 
    metrics 
  } = usePerformanceData(user, selectedPeriod);
  
  return (
    <AppLayout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Analyses Premium</h1>
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
            <Button variant="outline" asChild>
              <Link to="/statistics" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Retour aux statistiques</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue={selectedView} onValueChange={setSelectedView} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="performance">Analyse Performance</TabsTrigger>
            <TabsTrigger value="risk">Gestion du Risque</TabsTrigger>
            <TabsTrigger value="optimization">Optimisation</TabsTrigger>
            <TabsTrigger value="patterns">Patterns &amp; Timing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceComparison />
              
              <Card>
                <CardHeader>
                  <CardTitle>Métriques Avancées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Alpha (vs. S&P 500)</p>
                      <p className="text-2xl font-bold text-green-500">+2.87</p>
                      <p className="text-xs text-muted-foreground mt-1">Mesure la surperformance ajustée au risque</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Beta</p>
                      <p className="text-2xl font-bold">0.74</p>
                      <p className="text-xs text-muted-foreground mt-1">Sensibilité au marché (&lt; 1 = moins volatile)</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Ratio de Sortino</p>
                      <p className="text-2xl font-bold">1.93</p>
                      <p className="text-xs text-muted-foreground mt-1">Rendement ajusté au risque baissier</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Information Ratio</p>
                      <p className="text-2xl font-bold">1.32</p>
                      <p className="text-xs text-muted-foreground mt-1">Rendement excédentaire par unité de risque</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Analyse Sectorielle de Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <div className="grid grid-cols-2 h-full">
                  <div className="space-y-4 border-r pr-6">
                    <h3 className="text-lg font-medium">Corrélation par Secteur</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Technologie</span>
                        <div className="w-2/3 bg-secondary/30 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                        <span className="text-sm font-medium">0.85</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Finance</span>
                        <div className="w-2/3 bg-secondary/30 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "42%" }}></div>
                        </div>
                        <span className="text-sm font-medium">0.42</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Santé</span>
                        <div className="w-2/3 bg-secondary/30 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "63%" }}></div>
                        </div>
                        <span className="text-sm font-medium">0.63</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Énergie</span>
                        <div className="w-2/3 bg-secondary/30 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "21%" }}></div>
                        </div>
                        <span className="text-sm font-medium">0.21</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Consommation</span>
                        <div className="w-2/3 bg-secondary/30 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "67%" }}></div>
                        </div>
                        <span className="text-sm font-medium">0.67</span>
                      </div>
                    </div>
                  </div>
                  <div className="pl-6 space-y-4">
                    <h3 className="text-lg font-medium">Performance Relative</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Comparé à SPY (S&P 500)</span>
                        <div className="w-2/3 bg-secondary/30 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "132%" }}></div>
                        </div>
                        <span className="text-sm font-medium text-green-500">+32%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Comparé à QQQ (Nasdaq)</span>
                        <div className="w-2/3 bg-secondary/30 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "108%" }}></div>
                        </div>
                        <span className="text-sm font-medium text-green-500">+8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Comparé à IWM (Russell 2000)</span>
                        <div className="w-2/3 bg-secondary/30 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "153%" }}></div>
                        </div>
                        <span className="text-sm font-medium text-green-500">+53%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Comparé à XLF (Financials)</span>
                        <div className="w-2/3 bg-secondary/30 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                        </div>
                        <span className="text-sm font-medium text-red-500">-5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DrawdownChart />
              <VolatilityAnalysis />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Analyse Détaillée des Risques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Distribution des Pertes</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pertes &lt; 1%</span>
                        <span className="text-sm font-medium">42 trades (68.9%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pertes 1-3%</span>
                        <span className="text-sm font-medium">14 trades (22.9%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pertes 3-5%</span>
                        <span className="text-sm font-medium">4 trades (6.6%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pertes &gt; 5%</span>
                        <span className="text-sm font-medium">1 trade (1.6%)</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium pt-4">Value at Risk (VaR)</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">VaR quotidien (95%)</span>
                        <span className="text-sm font-medium">-2.34%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">VaR quotidien (99%)</span>
                        <span className="text-sm font-medium">-4.17%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Expected Shortfall (ES)</span>
                        <span className="text-sm font-medium">-3.86%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Indicateurs de Risque</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Volatilité Annualisée</span>
                        <span className="text-sm font-medium">18.7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Downside Deviation</span>
                        <span className="text-sm font-medium">12.3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Kurtosis</span>
                        <span className="text-sm font-medium">3.42</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Skewness</span>
                        <span className="text-sm font-medium">0.18</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium pt-4">Concentration du Risque</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Top 5 positions</span>
                        <span className="text-sm font-medium">48.7% du capital</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Secteur principal</span>
                        <span className="text-sm font-medium">Technologie (34.2%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <RiskReturnScatter />
          </TabsContent>
          
          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations d'Optimisation du Portefeuille</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Diversification sectorielle
                    </h4>
                    <p className="text-sm mb-2">Réduction de l'exposition au secteur technologique</p>
                    <p className="text-xs text-muted-foreground">
                      Votre portefeuille montre une surexposition (48%) au secteur technologique. Une réduction à 35% pourrait améliorer votre ratio de Sharpe de 0.3 et réduire le drawdown maximal de 3.2%.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Optimisation de la taille des positions
                    </h4>
                    <p className="text-sm mb-2">Redimensionnement des positions existantes</p>
                    <p className="text-xs text-muted-foreground">
                      L'analyse des performances montre que vos positions de taille moyenne (3-4% du capital) ont un meilleur rapport rendement/risque que les positions plus importantes. Limiter la taille maximale à 5% du capital améliorerait les performances ajustées au risque d'environ 8%.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Ajustement des stratégies
                    </h4>
                    <p className="text-sm mb-2">Renforcement des stratégies les plus efficaces</p>
                    <p className="text-xs text-muted-foreground">
                      Les données montrent que votre stratégie "Momentum" génère un ROI moyen de 2.8x supérieur à votre stratégie "Reversion à la moyenne", avec une volatilité seulement 1.2x plus élevée. En augmentant l'allocation à cette stratégie de 25% à 40%, vous pourriez améliorer le rendement annualisé de 4.7%.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Optimisation des stops
                    </h4>
                    <p className="text-sm mb-2">Ajustement dynamique des stop loss</p>
                    <p className="text-xs text-muted-foreground">
                      Selon l'analyse des 87 derniers trades, l'utilisation de stops basés sur l'ATR (Average True Range) plutôt que des stops fixes pourrait réduire de 23% le montant moyen des pertes tout en permettant aux trades gagnants de se développer pleinement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patterns" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patterns de Trading</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Patterns les plus rentables</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Double fond</span>
                        <span className="text-sm font-medium text-green-500">+87% win rate</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pullback sur EMA20</span>
                        <span className="text-sm font-medium text-green-500">+76% win rate</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Break de résistance</span>
                        <span className="text-sm font-medium text-green-500">+72% win rate</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Divergence RSI</span>
                        <span className="text-sm font-medium text-green-500">+68% win rate</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium pt-4">Patterns à éviter</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Achat sur gap haussier</span>
                        <span className="text-sm font-medium text-red-500">34% win rate</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Vente sur gap baissier</span>
                        <span className="text-sm font-medium text-red-500">41% win rate</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Trading contre tendance</span>
                        <span className="text-sm font-medium text-red-500">37% win rate</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Analyse Temporelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Meilleurs moments</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Jour de la semaine</span>
                        <span className="text-sm font-medium">Mardi (+2.7%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Heure de la journée</span>
                        <span className="text-sm font-medium">10h-11h (+1.8%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Période du mois</span>
                        <span className="text-sm font-medium">15-22 (+3.2%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Événements</span>
                        <span className="text-sm font-medium">Post-FOMC (+4.5%)</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium pt-4">Moments à éviter</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Jour de la semaine</span>
                        <span className="text-sm font-medium">Vendredi (-1.3%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Heure de la journée</span>
                        <span className="text-sm font-medium">15h30-16h (-1.9%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Période du mois</span>
                        <span className="text-sm font-medium">28-31 (-2.1%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Corrélation Performance / Conditions de Marché</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Conditions Favorables</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Volatilité VIX</span>
                        <span className="text-sm font-medium">15-25 (+3.2%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Volume</span>
                        <span className="text-sm font-medium">+20% vs moyenne (+2.8%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tendance</span>
                        <span className="text-sm font-medium">Haussière claire (+4.7%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Liquidité</span>
                        <span className="text-sm font-medium">Élevée (+2.1%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Conditions Défavorables</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Volatilité VIX</span>
                        <span className="text-sm font-medium">+35 (-3.7%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Volume</span>
                        <span className="text-sm font-medium">-30% vs moyenne (-2.4%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tendance</span>
                        <span className="text-sm font-medium">Range latéral (-1.8%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Liquidité</span>
                        <span className="text-sm font-medium">Faible (-3.2%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
