
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export function PremiumAnalyticsContent() {
  // Données avancées pour utilisateurs premium
  const performanceData = [
    { date: '2023-01', value: 1200 },
    { date: '2023-02', value: -500 },
    { date: '2023-03', value: 800 },
    { date: '2023-04', value: 1600 },
    { date: '2023-05', value: -300 },
    { date: '2023-06', value: 2000 },
    { date: '2023-07', value: 1000 },
    { date: '2023-08', value: 1400 },
    { date: '2023-09', value: -200 },
    { date: '2023-10', value: 900 },
    { date: '2023-11', value: 1700 },
    { date: '2023-12', value: 2500 },
  ];

  const strategyData = [
    { name: 'Day Trading', success: 68, trades: 120 },
    { name: 'Swing', success: 82, trades: 75 },
    { name: 'Position', success: 91, trades: 42 },
    { name: 'Scalping', success: 59, trades: 180 },
  ];

  const assetData = [
    { name: 'Actions', value: 4000 },
    { name: 'Crypto', value: 3000 },
    { name: 'Forex', value: 2000 },
    { name: 'Matières premières', value: 1500 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyse de performance avancée</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={performanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse par stratégie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={strategyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" fill="#82ca9d" name="Taux de réussite (%)" />
                <Bar dataKey="trades" fill="#8884d8" name="Nombre de trades" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métriques avancées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Ratio de Sharpe</p>
                <p className="text-2xl font-bold">1.87</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Ratio de Sortino</p>
                <p className="text-2xl font-bold">2.14</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Drawdown Maximum</p>
                <p className="text-2xl font-bold text-destructive">-12.3%</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">ROI Annualisé</p>
                <p className="text-2xl font-bold text-green-500">+24.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
