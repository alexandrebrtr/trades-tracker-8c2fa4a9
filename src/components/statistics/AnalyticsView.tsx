import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface AnalyticsData {
  date: string;
  value: number;
}

interface PerformanceSummaryProps {
  totalPnl: number;
  averageWin: number;
  averageLoss: number;
  winRate: number;
  lossRate: number;
}

interface AssetAllocationData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.07;
  const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.07;

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const getBarColor = (value: number): string => {
  return value >= 0 ? '#4ade80' : '#f87171';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary border rounded-md p-3 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          Value: <span className="font-semibold">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

const AnalyticsView = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummaryProps | null>(null);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch analytics data
        const { data: analytics, error: analyticsError } = await supabase
          .from('trades')
          .select('date, pnl')
          .eq('user_id', user.id);

        if (analyticsError) throw analyticsError;

        // Transform analytics data
        const transformedAnalyticsData: AnalyticsData[] = analytics.map((item: any) => ({
          date: item.date,
          value: item.pnl,
        }));
        setAnalyticsData(transformedAnalyticsData);

        // Calculate performance summary
        const totalPnl = analytics.reduce((sum: number, item: any) => sum + item.pnl, 0);
        const wins = analytics.filter((item: any) => item.pnl > 0);
        const losses = analytics.filter((item: any) => item.pnl <= 0);
        const averageWin = wins.length > 0 ? wins.reduce((sum: number, item: any) => sum + item.pnl, 0) / wins.length : 0;
        const averageLoss = losses.length > 0 ? losses.reduce((sum: number, item: any) => sum + item.pnl, 0) / losses.length : 0;
        const winRate = (wins.length / analytics.length) * 100 || 0;
        const lossRate = (losses.length / analytics.length) * 100 || 0;

        setPerformanceSummary({
          totalPnl,
          averageWin,
          averageLoss,
          winRate,
          lossRate,
        });

        // Mock asset allocation data (replace with actual data fetching later)
        setAssetAllocation([
          { name: 'Actions', value: 400, color: COLORS[0] },
          { name: 'Crypto', value: 300, color: COLORS[1] },
          { name: 'Forex', value: 200, color: COLORS[2] },
          { name: 'Commodities', value: 100, color: COLORS[3] },
        ]);
      } catch (error: any) {
        console.error('Error fetching analytics data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getRevenueData = () => {
    const data = [
      {
        name: "Jan",
        Revenue: 1300,
      },
      {
        name: "Feb",
        Revenue: 1600,
      },
      {
        name: "Mar",
        Revenue: 1420,
      },
      {
        name: "Apr",
        Revenue: 1500,
      },
      {
        name: "May",
        Revenue: 1790,
      },
      {
        name: "Jun",
        Revenue: 2100,
      },
      {
        name: "Jul",
        Revenue: 2600,
      },
      {
        name: "Aug",
        Revenue: 2900,
      },
      {
        name: "Sep",
        Revenue: 2000,
      },
      {
        name: "Oct",
        Revenue: 2300,
      },
      {
        name: "Nov",
        Revenue: 2600,
      },
      {
        name: "Dec",
        Revenue: 2800,
      },
    ];

    return data;
  };

  const getVisitsData = () => {
    const data = [
      {
        name: "Jan",
        Visits: 2300,
      },
      {
        name: "Feb",
        Visits: 1600,
      },
      {
        name: "Mar",
        Visits: 3420,
      },
      {
        name: "Apr",
        Visits: 4500,
      },
      {
        name: "May",
        Visits: 3790,
      },
      {
        name: "Jun",
        Visits: 2100,
      },
      {
        name: "Jul",
        Visits: 5600,
      },
      {
        name: "Aug",
        Visits: 2900,
      },
      {
        name: "Sep",
        Visits: 4000,
      },
      {
        name: "Oct",
        Visits: 2300,
      },
      {
        name: "Nov",
        Visits: 5600,
      },
      {
        name: "Dec",
        Visits: 2800,
      },
    ];

    return data;
  };

  const getConversionData = () => {
    const data = [
      {
        name: "Jan",
        Conversion: 0.3,
      },
      {
        name: "Feb",
        Conversion: 0.6,
      },
      {
        name: "Mar",
        Conversion: 0.4,
      },
      {
        name: "Apr",
        Conversion: 0.5,
      },
      {
        name: "May",
        Conversion: 0.8,
      },
      {
        name: "Jun",
        Conversion: 0.2,
      },
      {
        name: "Jul",
        Conversion: 0.2,
      },
      {
        name: "Aug",
        Conversion: 0.9,
      },
      {
        name: "Sep",
        Conversion: 0.1,
      },
      {
        name: "Oct",
        Conversion: 0.7,
      },
      {
        name: "Nov",
        Conversion: 0.4,
      },
      {
        name: "Dec",
        Conversion: 0.7,
      },
    ];

    return data;
  };

  const getCategoryData = () => {
    const data = [
      {
        name: "Shoes",
        value: 400,
      },
      {
        name: "Bags",
        value: 300,
      },
      {
        name: "T-shirts",
        value: 200,
      },
      {
        name: "Pants",
        value: 100,
      },
    ];

    return data;
  };

  const RevenueData = getRevenueData();
  const VisitsData = getVisitsData();
  const ConversionData = getConversionData();
  const CategoryData = getCategoryData();

  if (loading) {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-80" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px]" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-80" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-80" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!performanceSummary) {
    return <p>No analytics data available.</p>;
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Performances des Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="md:flex items-start justify-between py-4">
            <div className="mb-4 md:mb-0">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total P&L
              </h3>
              <p className="text-2xl font-bold">
                {performanceSummary.totalPnl.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                Win Rate: {performanceSummary.winRate.toFixed(2)}%
              </Badge>
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                Loss Rate: {performanceSummary.lossRate.toFixed(2)}%
              </Badge>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={analyticsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="#8884d8" 
                // Use an explicit fill color and then use a custom shape if needed
                shape={(props) => {
                  const { x, y, width, height, value } = props;
                  const color = value > 0 ? "#4ade80" : "#f87171";
                  return <rect x={x} y={y} width={width} height={height} fill={color} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={160}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visites</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={VisitsData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Visits" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={RevenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={ConversionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Conversion" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={CategoryData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsView;
