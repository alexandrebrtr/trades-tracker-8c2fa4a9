
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { DataCard } from "@/components/ui/data-card";
import { TrendingUp, TrendingDown, Percent, Clock, BarChart3, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

const PerformanceMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Données simulées
  const cumulativeReturnsData = [
    { date: 'Jan', return: 1000 },
    { date: 'Feb', return: 1300 },
    { date: 'Mar', return: 900 },
    { date: 'Apr', return: 1500 },
    { date: 'May', return: 1700 },
    { date: 'Jun', return: 1400 },
    { date: 'Jul', return: 2200 },
    { date: 'Aug', return: 2800 },
    { date: 'Sep', return: 2500 },
    { date: 'Oct', return: 3000 },
    { date: 'Nov', return: 3200 },
    { date: 'Dec', return: 4000 },
  ];

  const monthlyReturnsData = [
    { month: 'Jan', return: 300 },
    { month: 'Feb', return: 300 },
    { month: 'Mar', return: -400 },
    { month: 'Apr', return: 600 },
    { month: 'May', return: 200 },
    { month: 'Jun', return: -300 },
    { month: 'Jul', return: 800 },
    { month: 'Aug', return: 600 },
    { month: 'Sep', return: -300 },
    { month: 'Oct', return: 500 },
    { month: 'Nov', return: 200 },
    { month: 'Dec', return: 800 },
  ];

  const dailyReturnsData = [
    { time: '1h', volatility: 0.8 },
    { time: '2h', volatility: 1.2 },
    { time: '3h', volatility: 0.9 },
    { time: '4h', volatility: 1.5 },
    { time: '1d', volatility: 2.1 },
    { time: '3d', volatility: 2.7 },
    { time: '1w', volatility: 3.2 },
    { time: '2w', volatility: 4.1 },
    { time: '1m', volatility: 5.3 },
    { time: '3m', volatility: 6.2 },
    { time: '6m', volatility: 7.1 },
    { time: '1y', volatility: 8.9 },
  ];

  // Calculer les métriques clés
  const totalReturn = 4000;
  const annualizedReturn = 28.5;
  const sharpeRatio = 1.8;
  const maxDrawdown = -15.2;
  const winRate = 68.5;
  const averageHoldingPeriod = "3.2 jours";

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Métriques de Performance</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DataCard
          title="Rendement Total"
          value={`${totalReturn.toLocaleString('fr-FR')} €`}
          icon={<TrendingUp className="h-4 w-4" />}
          valueClassName="text-profit"
        />
        <DataCard
          title="Rendement Annualisé"
          value={`${annualizedReturn}%`}
          icon={<Percent className="h-4 w-4" />}
          valueClassName="text-profit"
        />
        <DataCard
          title="Ratio de Sharpe"
          value={sharpeRatio.toString()}
          icon={<BarChart3 className="h-4 w-4" />}
          tooltip="Mesure du rendement ajusté au risque. Plus élevé = meilleur."
        />
        <DataCard
          title="Drawdown Maximum"
          value={`${maxDrawdown}%`}
          icon={<TrendingDown className="h-4 w-4" />}
          valueClassName="text-loss"
          tooltip="La plus grande perte en pourcentage depuis un sommet."
        />
        <DataCard
          title="Taux de Réussite"
          value={`${winRate}%`}
          icon={<Target className="h-4 w-4" />}
        />
        <DataCard
          title="Durée Moyenne"
          value={averageHoldingPeriod}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rendements Cumulés</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={cumulativeReturnsData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="return" stroke="#4ade80" fill="#4ade80" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendements Mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyReturnsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="return" 
                  name="Rendement" 
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
            <CardTitle>Volatilité par Horizon Temporel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dailyReturnsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="volatility" stroke="#8884d8" activeDot={{ r: 8 }} name="Volatilité (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
