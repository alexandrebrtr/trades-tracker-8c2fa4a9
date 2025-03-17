
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface CumulativeReturnsChartProps {
  data: any[];
}

export const CumulativeReturnsChart = ({ data }: CumulativeReturnsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendements Cumulés</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} €`, 'Rendement']} />
            <Area type="monotone" dataKey="return" stroke="#4ade80" fill="#4ade80" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
