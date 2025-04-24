
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WinLossDistributionChartProps {
  data: {
    winCount: number;
    lossCount: number;
  };
  loading?: boolean;
}

export function WinLossDistributionChart({ data, loading }: WinLossDistributionChartProps) {
  if (loading) {
    return <div className="animate-pulse bg-muted h-[300px] rounded-lg" />;
  }

  const { winCount, lossCount } = data;
  const totalTrades = winCount + lossCount;
  const winRate = totalTrades > 0 ? Math.round((winCount / totalTrades) * 100) : 0;

  const chartData = [
    { name: 'Gagnants', value: winCount, color: '#82ca9d' },
    { name: 'Perdants', value: lossCount, color: '#ff8884' },
  ];

  const COLORS = ['#82ca9d', '#ff8884'];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Distribution des Trades</CardTitle>
          <div className="text-sm font-medium">
            Taux de réussite: <span className={winRate >= 50 ? 'text-green-500' : 'text-red-500'}>{winRate}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {totalTrades > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} trades`, '']}
                />
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
