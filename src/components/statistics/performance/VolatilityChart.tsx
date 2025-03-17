
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface VolatilityChartProps {
  data: any[];
}

export const VolatilityChart = ({ data }: VolatilityChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volatilité par Horizon Temporel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, 'Volatilité']} />
            <Legend />
            <Line type="monotone" dataKey="volatility" stroke="#8884d8" activeDot={{ r: 8 }} name="Volatilité (%)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
