
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#22c55e', '#ef4444'];

interface WinLossDistributionChartProps {
  data: {
    winCount: number;
    lossCount: number;
  };
  loading?: boolean;
}

export function WinLossDistributionChart({ data, loading }: WinLossDistributionChartProps) {
  if (loading) {
    return <div className="animate-pulse bg-muted h-[350px] rounded-lg" />;
  }

  const chartData = [
    { name: 'Trades Gagnants', value: data.winCount },
    { name: 'Trades Perdants', value: data.lossCount }
  ];

  const total = data.winCount + data.lossCount;
  const winRate = total > 0 ? (data.winCount / total * 100).toFixed(1) : '0';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Distribution Gains/Pertes</CardTitle>
          <span className="text-sm font-medium">
            Win Rate: {winRate}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
