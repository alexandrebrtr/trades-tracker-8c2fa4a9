
import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Calendar, Clock } from 'lucide-react';
import { DataCard } from '@/components/ui/data-card';

// Mock data for profit/loss by day
const dailyProfitData = [
  { day: 'Lun', value: 450 },
  { day: 'Mar', value: -150 },
  { day: 'Mer', value: 320 },
  { day: 'Jeu', value: 580 },
  { day: 'Ven', value: -220 },
  { day: 'Sam', value: 120 },
  { day: 'Dim', value: 60 }
];

// Mock data for average holding time
const timeData = [
  { name: '<5m', value: 10 },
  { name: '5-15m', value: 25 },
  { name: '15-30m', value: 35 },
  { name: '30m-1h', value: 20 },
  { name: '1h-4h', value: 8 },
  { name: '>4h', value: 2 }
];

// Mock data for trades by strategy
const strategyData = [
  { name: 'Day Trading', value: 40 },
  { name: 'Swing', value: 30 },
  { name: 'Scalping', value: 20 },
  { name: 'Position', value: 10 },
];

const COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f97316', '#2dd4bf', '#fbbf24'];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border shadow-md">
        <p className="text-sm font-medium">{label}</p>
        <p className={`text-sm font-semibold ${payload[0].value >= 0 ? 'text-profit' : 'text-loss'}`}>
          {payload[0].value >= 0 ? '+' : ''}{payload[0].value} €
        </p>
      </div>
    );
  }
  return null;
};

// Time tooltip
const TimeTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border shadow-md">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm font-semibold">{payload[0].value}% des trades</p>
      </div>
    );
  }
  return null;
};

export function AnalyticsView() {
  const [timeframe, setTimeframe] = useState('1M');
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard
          title="Win Rate"
          value="68.5%"
          trend={{ value: 3.2, isPositive: true }}
        />
        
        <DataCard
          title="Profit Factor"
          value="2.14"
          trend={{ value: 0.23, isPositive: true }}
        />
        
        <DataCard
          title="Drawdown Maximum"
          value="8.4%"
          trend={{ value: 2.1, isPositive: false }}
          valueClassName="text-loss"
        />
        
        <DataCard
          title="Ratio Risque/Récompense"
          value="1.8"
          trend={{ value: 0.2, isPositive: true }}
        />
      </div>
      
      {/* Daily profit chart */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-6">Profits/Pertes par jour de la semaine</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyProfitData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `${value}€`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {dailyProfitData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value >= 0 ? '#34d399' : '#ef4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Distribution charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trade duration distribution */}
        <div className="glass-card">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Durée moyenne des trades</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<TimeTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Strategy distribution */}
        <div className="glass-card">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Répartition par stratégie</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={strategyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {strategyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
