import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  BarChart,
  Bar
} from 'recharts';
import { DataCard } from "@/components/ui/data-card";
import { Activity, TrendingUp, Award, Clock, Zap, Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdvancedAnalytics = () => {
  // Données simulées pour l'analyse avancée
  const riskReturnData = [
    { x: 5, y: 8, z: 100, name: 'Stratégie A' },
    { x: 7, y: 12, z: 200, name: 'Stratégie B' },
    { x: 3, y: 6, z: 150, name: 'Stratégie C' },
    { x: 8, y: 9, z: 300, name: 'Stratégie D' },
    { x: 10, y: 15, z: 400, name: 'Stratégie E' },
    { x: 6, y: 10, z: 250, name: 'Stratégie F' },
    { x: 9, y: 13, z: 350, name: 'Stratégie G' },
  ];

  const efficiencyFrontierData = [
    { risk: 2, return: 5 },
    { risk: 3, return: 7 },
    { risk: 4, return: 8.5 },
    { risk: 5, return: 9.5 },
    { risk: 6, return: 10.2 },
    { risk: 7, return: 10.7 },
    { risk: 8, return: 11.1 },
    { risk: 9, return: 11.4 },
    { risk: 10, return: 11.6 },
    { risk: 11, return: 11.8 },
    { risk: 12, return: 11.9 },
  ];

  const weekdayPerformanceData = [
    { day: 'Lundi', return: 1.2 },
    { day: 'Mardi', return: 0.8 },
    { day: 'Mercredi', return: 1.5 },
    { day: 'Jeudi', return: -0.5 },
    { day: 'Vendredi', return: 2.1 },
  ];

  const hourlyPerformanceData = [
    { hour: '9:00', return: 0.3 },
    { hour: '10:00', return: 0.7 },
    { hour: '11:00', return: 0.5 },
    { hour: '12:00', return: -0.2 },
    { hour: '13:00', return: -0.4 },
    { hour: '14:00', return: 0.6 },
    { hour: '15:00', return: 0.9 },
    { hour: '16:00', return: 1.2 },
    { hour: '17:00', return: 0.4 },
  ];

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Analyses Avancées</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DataCard
          title="Ratio de Sortino"
          value="2.3"
          icon={<TrendingUp className="h-4 w-4" />}
          tooltip="Mesure la performance ajustée au risque baissier uniquement."
        />
        <DataCard
          title="Ratio de Calmar"
          value="1.7"
          icon={<Activity className="h-4 w-4" />}
          tooltip="Rendement annualisé divisé par le drawdown maximum."
        />
        <DataCard
          title="Alpha de Jensen"
          value="3.8%"
          icon={<Award className="h-4 w-4" />}
          tooltip="Mesure de surperformance par rapport au benchmark."
        />
        <DataCard
          title="Meilleur Moment"
          value="16h-17h"
          icon={<Clock className="h-4 w-4" />}
          tooltip="Période de la journée avec les meilleurs rendements moyens."
        />
        <DataCard
          title="Meilleur Jour"
          value="Vendredi"
          icon={<Calendar className="h-4 w-4" />}
          tooltip="Jour de la semaine avec les meilleurs rendements moyens."
        />
        <DataCard
          title="Ratio de Gain/Perte"
          value="2.4"
          icon={<Zap className="h-4 w-4" />}
          tooltip="Moyenne des gains divisée par la moyenne des pertes."
        />
      </div>

      <Tabs defaultValue="risk" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="risk">Risque-Rendement</TabsTrigger>
          <TabsTrigger value="time">Analyse Temporelle</TabsTrigger>
          <TabsTrigger value="correlation">Corrélations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scatter Plot Risque-Rendement par Stratégie</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="Risque (%)" />
                  <YAxis type="number" dataKey="y" name="Rendement (%)" />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="Volume" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name, props) => {
                    if (name === 'z') return [`${value} trades`, 'Volume'];
                    return [`${value}%`, name === 'x' ? 'Risque' : 'Rendement'];
                  }} />
                  <Legend />
                  <Scatter name="Stratégies" data={riskReturnData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frontière d'Efficience</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={efficiencyFrontierData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risk" label={{ value: 'Risque (%)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Rendement (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="return" stroke="#82ca9d" name="Rendement Optimal" dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Jour de la Semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={weekdayPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis label={{ value: 'Rendement (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar
                    dataKey="return"
                    name="Rendement Moyen"
                    shape={(props) => {
                      const { x, y, width, height, value } = props;
                      const color = value >= 0 ? "#4ade80" : "#f87171";
                      return <rect x={x} y={y} width={width} height={height} fill={color} />;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance par Heure de la Journée</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={hourlyPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis label={{ value: 'Rendement (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="return" stroke="#8884d8" name="Rendement Moyen" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="correlation">
          <Card>
            <CardHeader>
              <CardTitle>Matrice de Corrélation entre Actifs</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="grid grid-cols-6 gap-2 w-full max-w-3xl">
                {/* En-têtes de colonnes */}
                <div className="flex justify-center font-semibold border-b"></div>
                <div className="flex justify-center font-semibold border-b">AAPL</div>
                <div className="flex justify-center font-semibold border-b">MSFT</div>
                <div className="flex justify-center font-semibold border-b">BTC</div>
                <div className="flex justify-center font-semibold border-b">ETH</div>
                <div className="flex justify-center font-semibold border-b">EUR/USD</div>
                
                {/* Ligne 1 */}
                <div className="flex justify-center font-semibold">AAPL</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
                <div className="flex justify-center bg-green-200 p-2 rounded">0.85</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.32</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.27</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.12</div>
                
                {/* Ligne 2 */}
                <div className="flex justify-center font-semibold">MSFT</div>
                <div className="flex justify-center bg-green-200 p-2 rounded">0.85</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.28</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.25</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.15</div>
                
                {/* Ligne 3 */}
                <div className="flex justify-center font-semibold">BTC</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.32</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.28</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
                <div className="flex justify-center bg-green-200 p-2 rounded">0.92</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.05</div>
                
                {/* Ligne 4 */}
                <div className="flex justify-center font-semibold">ETH</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.27</div>
                <div className="flex justify-center bg-blue-100 p-2 rounded">0.25</div>
                <div className="flex justify-center bg-green-200 p-2 rounded">0.92</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.08</div>
                
                {/* Ligne 5 */}
                <div className="flex justify-center font-semibold">EUR/USD</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.12</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.15</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.05</div>
                <div className="flex justify-center bg-red-100 p-2 rounded">-0.08</div>
                <div className="flex justify-center bg-green-300 p-2 rounded">1.00</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
