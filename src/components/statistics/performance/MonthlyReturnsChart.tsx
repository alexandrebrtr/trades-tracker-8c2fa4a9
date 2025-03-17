
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface MonthlyReturnsChartProps {
  data: any[];
}

export const MonthlyReturnsChart = ({ data }: MonthlyReturnsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendements Mensuels</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} €`, 'Rendement']} />
            <Bar 
              dataKey="return" 
              name="Rendement" 
              shape={(props) => {
                const { x, y, width, height, value } = props;
                const color = value >= 0 ? "#4ade80" : "#f87171";
                return <rect x={x} y={y} width={width} height={height} fill={color} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
