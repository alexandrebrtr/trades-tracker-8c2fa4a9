
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_CONFIG, DRAWDOWN_DATA } from "./chartConfig";

export function DrawdownChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse des Drawdowns</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="h-80">
          <AreaChart data={DRAWDOWN_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Drawdown" 
              stroke={CHART_CONFIG.danger.theme.light} 
              fill={CHART_CONFIG.danger.theme.light}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
