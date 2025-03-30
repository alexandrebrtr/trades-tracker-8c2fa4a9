
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface VolatilityChartProps {
  data: any[];
}

export const VolatilityChart = ({ data }: VolatilityChartProps) => {
  // Add a more descriptive tooltip formatter
  const tooltipFormatter = (value: any) => {
    return [`${value}%`, 'Volatilité'];
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse de Volatilité</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
            <p>Pas assez de données pour calculer la volatilité.</p>
            <p className="text-sm mt-2">Ajoutez plus de trades pour voir cette analyse.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 'dataMax + 5']} />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="volatility" 
                name="Volatilité" 
                stroke="#f43f5e" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Ce graphique montre la volatilité de votre portefeuille sur différentes périodes. 
          Une volatilité plus basse indique généralement un risque réduit.</p>
        </div>
      </CardContent>
    </Card>
  );
};
