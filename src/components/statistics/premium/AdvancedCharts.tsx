
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Configuration des couleurs pour les graphiques
const CHART_CONFIG = {
  primary: {
    theme: {
      light: "#9b87f5",
      dark: "#9b87f5",
    },
    label: "Performance"
  },
  secondary: {
    theme: {
      light: "#34d399",
      dark: "#34d399",
    },
    label: "Volatilité"
  },
  tertiary: {
    theme: {
      light: "#f97316",
      dark: "#f97316",
    },
    label: "Marché"
  },
  danger: {
    theme: {
      light: "#ef4444",
      dark: "#ef4444",
    },
    label: "Risque"
  },
};

// Données de démonstration
const PERFORMANCE_DATA = [
  { date: "Jan", value: 1200, benchmark: 1000 },
  { date: "Fev", value: 1800, benchmark: 1200 },
  { date: "Mar", value: 1600, benchmark: 1300 },
  { date: "Avr", value: 2200, benchmark: 1400 },
  { date: "Mai", value: 1900, benchmark: 1500 },
  { date: "Jun", value: 2400, benchmark: 1600 },
  { date: "Jul", value: 2800, benchmark: 1700 },
  { date: "Aou", value: 3200, benchmark: 1800 },
  { date: "Sep", value: 3600, benchmark: 1900 },
  { date: "Oct", value: 3300, benchmark: 2000 },
  { date: "Nov", value: 3900, benchmark: 2100 },
  { date: "Dec", value: 4500, benchmark: 2200 },
];

const VOLATILITY_DATA = [
  { month: "Jan", portfolio: 12, market: 18 },
  { month: "Fev", portfolio: 14, market: 20 },
  { month: "Mar", portfolio: 10, market: 17 },
  { month: "Avr", portfolio: 13, market: 19 },
  { month: "Mai", portfolio: 15, market: 22 },
  { month: "Jun", portfolio: 11, market: 16 },
  { month: "Jul", portfolio: 9, market: 15 },
  { month: "Aou", portfolio: 12, market: 18 },
  { month: "Sep", portfolio: 14, market: 21 },
  { month: "Oct", portfolio: 16, market: 23 },
  { month: "Nov", portfolio: 13, market: 20 },
  { month: "Dec", portfolio: 11, market: 17 },
];

const DRAWDOWN_DATA = [
  { date: "Jan", value: 0 },
  { date: "Fev", value: -2 },
  { date: "Mar", value: -5 },
  { date: "Avr", value: -3 },
  { date: "Mai", value: -7 },
  { date: "Jun", value: -10 },
  { date: "Jul", value: -4 },
  { date: "Aou", value: -2 },
  { date: "Sep", value: -8 },
  { date: "Oct", value: -12 },
  { date: "Nov", value: -6 },
  { date: "Dec", value: -3 },
];

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

export function RiskReturnScatter() {
  const data = [
    { name: "Strategy A", risk: 15, return: 25, size: 200 },
    { name: "Strategy B", risk: 10, return: 15, size: 150 },
    { name: "Strategy C", risk: 20, return: 30, size: 220 },
    { name: "Strategy D", risk: 25, return: 18, size: 180 },
    { name: "Votre Portfolio", risk: 12, return: 22, size: 250 },
    { name: "S&P 500", risk: 18, return: 20, size: 200 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risque vs Rendement</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <svg width="100%" height="100%" viewBox="0 0 400 400">
            {/* Axe Y */}
            <line x1="50" y1="50" x2="50" y2="350" stroke="#ccc" />
            <text x="25" y="200" textAnchor="middle" transform="rotate(-90, 25, 200)">Rendement (%)</text>
            
            {/* Axe X */}
            <line x1="50" y1="350" x2="350" y2="350" stroke="#ccc" />
            <text x="200" y="380" textAnchor="middle">Risque (%)</text>
            
            {/* Points */}
            {data.map((item, index) => {
              const x = 50 + (item.risk / 30) * 300;
              const y = 350 - (item.return / 40) * 300;
              const color = item.name === "Votre Portfolio" 
                ? "#9b87f5" 
                : item.name === "S&P 500" 
                  ? "#f97316" 
                  : "#34d399";
              
              return (
                <g key={index}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={Math.sqrt(item.size) / 6} 
                    fill={color} 
                    opacity={0.7} 
                  />
                  <text 
                    x={x} 
                    y={y - 15} 
                    textAnchor="middle" 
                    fill="#444" 
                    fontSize="12px"
                  >
                    {item.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
