
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TradeVolumeChartProps {
  data: Array<{
    period: string;
    count: number;
  }>;
  loading?: boolean;
}

export function TradeVolumeChart({ data, loading }: TradeVolumeChartProps) {
  if (loading) {
    return <div className="animate-pulse bg-muted h-[350px] rounded-lg" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume de Trades par Période</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} trades`, 'Nombre de trades']}
                  labelFormatter={(label) => `Période: ${label}`}
                />
                <Bar
                  dataKey="count"
                  fill="#82ca9d" // Couleur verte pour les volumes
                  radius={[4, 4, 0, 0]}
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
