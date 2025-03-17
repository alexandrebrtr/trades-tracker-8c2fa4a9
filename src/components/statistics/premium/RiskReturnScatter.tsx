
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";

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
