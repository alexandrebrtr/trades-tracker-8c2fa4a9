
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_CONFIG, VOLATILITY_DATA } from "./chartConfig";

export function VolatilityAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse de Volatilité</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="h-80">
          <BarChart data={VOLATILITY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="portfolio" name="Portefeuille" fill={CHART_CONFIG.secondary.theme.light} radius={[4, 4, 0, 0]} />
            <Bar dataKey="market" name="Marché" fill={CHART_CONFIG.danger.theme.light} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
