
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line, ComposedChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CustomTooltip } from "../../dashboard/chart/CustomTooltip";

interface PerformanceChartProps {
  data: Array<{
    date: string;
    value: number;
    dailyChange?: number;
  }>;
  loading?: boolean;
  totalGain: number;
}

export function PerformanceChart({ data, loading, totalGain }: PerformanceChartProps) {
  if (loading) {
    return <div className="animate-pulse bg-muted h-[350px] rounded-lg" />;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Performance du Capital</CardTitle>
          <Badge variant={totalGain >= 0 ? "default" : "destructive"}>
            {totalGain >= 0 ? "+" : ""}{formatCurrency(totalGain)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
                  hide
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="value"
                  name="Capital"
                  stroke="#8884d8"
                  fill="url(#colorCapital)"
                  strokeWidth={2}
                />
                <Bar
                  yAxisId="right"
                  dataKey="dailyChange"
                  name="Variation journalière"
                  fill="url(#colorDaily)"
                  radius={[4, 4, 0, 0]}
                  barSize={6}
                />
              </ComposedChart>
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
