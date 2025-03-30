
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface MonthlyReturnsChartProps {
  data: any[];
}

export const MonthlyReturnsChart = ({ data }: MonthlyReturnsChartProps) => {
  // Find min and max values to ensure proper y-axis domain
  const minValue = Math.min(...data.map(item => item.return));
  const maxValue = Math.max(...data.map(item => item.return));
  
  // Add padding to min/max for better visualization
  const yAxisMin = Math.floor(minValue * 1.1);
  const yAxisMax = Math.ceil(maxValue * 1.1);

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
            <YAxis 
              domain={[yAxisMin < 0 ? yAxisMin : 0, yAxisMax]} 
            />
            <Tooltip formatter={(value) => [`${value} €`, 'Rendement']} />
            <Bar 
              dataKey="return" 
              name="Rendement" 
              shape={(props) => {
                const { x, y, width, height, value } = props;
                const color = value >= 0 ? "#4ade80" : "#f87171";
                
                // For positive values, bars grow upward from y
                // For negative values, bars grow downward from the zero line
                if (value >= 0) {
                  return <rect x={x} y={y} width={width} height={Math.abs(height)} fill={color} />;
                } else {
                  // For negative values, we need to adjust the y position to start from the zero line
                  const zeroY = props.background?.y || y;
                  return <rect x={x} y={zeroY} width={width} height={Math.abs(height)} fill={color} />;
                }
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
