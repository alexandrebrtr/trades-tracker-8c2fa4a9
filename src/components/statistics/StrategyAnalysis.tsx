
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
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
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StrategyAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Données simulées pour l'analyse des stratégies
  const strategyPerformanceData = [
    { name: 'Momentum', winRate: 68, totalTrades: 42, averagePnL: 320 },
    { name: 'Breakout', winRate: 52, totalTrades: 35, averagePnL: 180 },
    { name: 'Support/Resistance', winRate: 75, totalTrades: 28, averagePnL: 450 },
    { name: 'Swing Trading', winRate: 63, totalTrades: 30, averagePnL: 280 },
    { name: 'Trend Following', winRate: 71, totalTrades: 25, averagePnL: 390 },
  ];

  const strategyCategoryData = [
    { name: 'Momentum', value: 42 },
    { name: 'Breakout', value: 35 },
    { name: 'Support/Resistance', value: 28 },
    { name: 'Swing Trading', value: 30 },
    { name: 'Trend Following', value: 25 },
  ];

  const timePerformanceData = [
    { month: 'Jan', Momentum: 28, Breakout: -12, 'Support/Resistance': 40, 'Swing Trading': 15, 'Trend Following': 32 },
    { month: 'Feb', Momentum: -15, Breakout: 25, 'Support/Resistance': 35, 'Swing Trading': 22, 'Trend Following': 18 },
    { month: 'Mar', Momentum: 35, Breakout: 30, 'Support/Resistance': -10, 'Swing Trading': 42, 'Trend Following': 25 },
    { month: 'Apr', Momentum: 40, Breakout: 15, 'Support/Resistance': 28, 'Swing Trading': -18, 'Trend Following': 30 },
    { month: 'May', Momentum: 22, Breakout: -20, 'Support/Resistance': 45, 'Swing Trading': 30, 'Trend Following': 20 },
    { month: 'Jun', Momentum: -10, Breakout: 35, 'Support/Resistance': 30, 'Swing Trading': 25, 'Trend Following': -15 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analyse des Stratégies</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance par Stratégie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={strategyPerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="winRate" fill="#0088FE" name="Taux de réussite (%)" />
                <Bar dataKey="averagePnL" fill="#00C49F" name="P&L moyen (€)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Stratégies</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={strategyCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {strategyCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance dans le Temps par Stratégie</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={timePerformanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Momentum" stroke="#0088FE" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Breakout" stroke="#00C49F" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Support/Resistance" stroke="#FFBB28" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Swing Trading" stroke="#FF8042" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Trend Following" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyAnalysis;
