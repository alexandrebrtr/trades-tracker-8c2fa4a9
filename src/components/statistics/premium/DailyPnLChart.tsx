
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrencySettings } from '@/hooks/useCurrencySettings';

interface DailyPnLChartProps {
  data?: any[];
  isLoading?: boolean;
}

export function DailyPnLChart({ data = [], isLoading = false }: DailyPnLChartProps) {
  const { currency } = useCurrencySettings();
  
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      date: item.date,
      pnl: item.pnl,
      formattedDate: format(new Date(item.date), 'P', { locale: fr }),
    }));
  }, [data]);
  
  const maxValue = useMemo(() => {
    if (!chartData || chartData.length === 0) return 0;
    return Math.max(...chartData.map(item => Math.abs(item.pnl))) * 1.1;
  }, [chartData]);
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background p-3 border rounded-md shadow-md">
          <p className="font-medium">{data.formattedDate}</p>
          <p className={`text-sm ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: currency.code
            }).format(data.pnl)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-5 w-1/3 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle>P&L quotidien</CardTitle>
        <CardDescription>Performance journalière des trades clôturés</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.slice(0, 5)}
              />
              <YAxis
                tickFormatter={(value) => 
                  new Intl.NumberFormat('fr-FR', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    style: 'currency',
                    currency: currency.code,
                    maximumFractionDigits: 1
                  }).format(value)
                }
              />
              <Tooltip content={customTooltip} />
              <Legend />
              <ReferenceLine y={0} stroke="#666" />
              <Bar 
                dataKey="pnl" 
                name="P&L" 
                fill={(d) => d.pnl >= 0 ? "#4ade80" : "#f87171"} 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée à afficher</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
