
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface StrategyPerformanceChartProps {
  data: Array<{
    strategy: string;
    pnl: number;
  }>;
  loading?: boolean;
}

export function StrategyPerformanceChart({ data, loading }: StrategyPerformanceChartProps) {
  if (loading) {
    return <div className="animate-pulse bg-muted h-[350px] rounded-lg" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance par Stratégie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })} />
                <YAxis type="category" dataKey="strategy" width={120} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'P&L']}
                  labelFormatter={(label) => `Stratégie: ${label}`}
                />
                <Bar
                  dataKey="pnl"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
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
