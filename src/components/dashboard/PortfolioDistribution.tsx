
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Default data if no user data is provided
const defaultAssetData = [
  { name: 'Ajoutez vos actifs', value: 100 },
];

const defaultStrategyData = [
  { name: 'Ajoutez vos trades', value: 100 },
];

const ASSET_COLORS = ['#60a5fa', '#34d399', '#a78bfa', '#f97316', '#ec4899', '#fbbf24', '#f43f5e', '#06b6d4'];
const STRATEGY_COLORS = ['#2dd4bf', '#fbbf24', '#ef4444', '#a78bfa', '#3b82f6', '#22c55e', '#f97316', '#d946ef'];

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

// Custom legend renderer - optimisé avec useMemo
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

interface PortfolioDistributionProps {
  assetData: Array<{ name: string, value: number }> | null;
  strategyData: Array<{ name: string, value: number }> | null;
}

export function PortfolioDistribution({ assetData, strategyData }: PortfolioDistributionProps) {
  // Utiliser useMemo pour éviter des recalculs inutiles
  const displayAssetData = useMemo(() => {
    // Vérifier si les données sont valides (doivent avoir des valeurs et des noms)
    if (assetData && assetData.length > 0 && assetData.every(item => item.name && item.value !== undefined)) {
      return assetData;
    }
    return defaultAssetData;
  }, [assetData]);

  const displayStrategyData = useMemo(() => {
    // Vérifier si les données sont valides (doivent avoir des valeurs et des noms)
    if (strategyData && strategyData.length > 0 && strategyData.every(item => item.name && item.value !== undefined)) {
      return strategyData;
    }
    return defaultStrategyData;
  }, [strategyData]);

  // Optimiser les cellules avec useMemo
  const assetCells = useMemo(() => 
    displayAssetData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
    )), 
    [displayAssetData]
  );

  const strategyCells = useMemo(() => 
    displayStrategyData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={STRATEGY_COLORS[index % STRATEGY_COLORS.length]} />
    )), 
    [displayStrategyData]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-4">Répartition par actif</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayAssetData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {assetCells}
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
                data={displayStrategyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {strategyCells}
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
