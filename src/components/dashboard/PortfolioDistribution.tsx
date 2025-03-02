
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Mock data
const assetData = [
  { name: 'Actions', value: 45 },
  { name: 'Forex', value: 25 },
  { name: 'Crypto', value: 20 },
  { name: 'Matières premières', value: 10 },
];

const strategyData = [
  { name: 'Day Trading', value: 40 },
  { name: 'Swing', value: 30 },
  { name: 'Scalping', value: 20 },
  { name: 'Position', value: 10 },
];

const ASSET_COLORS = ['#60a5fa', '#34d399', '#a78bfa', '#f97316'];
const STRATEGY_COLORS = ['#2dd4bf', '#fbbf24', '#ef4444', '#a78bfa'];

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border shadow-md">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm font-semibold">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

// Custom legend renderer
const renderCustomizedLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-2">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium">{entry.value} ({entry.payload.value}%)</span>
        </div>
      ))}
    </div>
  );
};

export function PortfolioDistribution() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-4">Répartition par actif</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderCustomizedLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-4">Répartition par stratégie</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={strategyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {strategyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STRATEGY_COLORS[index % STRATEGY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderCustomizedLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
