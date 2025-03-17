
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_CONFIG, PERFORMANCE_DATA } from "./chartConfig";

export function PerformanceComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison avec le Marché (S&P 500)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="h-80">
          <LineChart data={PERFORMANCE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Portefeuille" 
              stroke={CHART_CONFIG.primary.theme.light}
              strokeWidth={2} 
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="benchmark" 
              name="S&P 500" 
              stroke={CHART_CONFIG.tertiary.theme.light}
              strokeWidth={2} 
              dot={{ r: 4 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
