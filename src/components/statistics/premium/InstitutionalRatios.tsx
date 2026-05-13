import { useMemo } from 'react';
import { DataCard } from '@/components/ui/data-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp, Activity, Target, AlertTriangle, BarChart3, Percent,
  Shield, Award, Flame, Calculator, Gauge, Skull,
} from 'lucide-react';
import { computeQuantMetrics, returnDistribution } from '@/utils/quantStats';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, ReferenceLine,
} from 'recharts';

interface InstitutionalRatiosProps {
  trades: any[];
  initialCapital: number;
}

const fmtMoney = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

const fmtPct = (v: number) => `${v.toFixed(2)}%`;

export function InstitutionalRatios({ trades, initialCapital }: InstitutionalRatiosProps) {
  const m = useMemo(() => computeQuantMetrics(trades, initialCapital), [trades, initialCapital]);
  const dist = useMemo(() => returnDistribution(trades.map(t => Number(t.pnl) || 0), 25), [trades]);

  const equity = useMemo(() => {
    const sorted = [...trades]
      .filter(t => Number.isFinite(Number(t.pnl)))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let v = initialCapital;
    let peak = initialCapital;
    return sorted.map((t, i) => {
      v += Number(t.pnl) || 0;
      if (v > peak) peak = v;
      const dd = peak > 0 ? ((v - peak) / peak) * 100 : 0;
      return { i: i + 1, equity: v, drawdown: dd };
    });
  }, [trades, initialCapital]);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> Ratios de performance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DataCard title="Sharpe Ratio" value={m.sharpeRatio.toFixed(2)} icon={<Gauge className="h-4 w-4" />}
            tooltip="Rendement excédentaire par unité de risque total. >1 bon, >2 excellent." />
          <DataCard title="Sortino Ratio" value={m.sortinoRatio.toFixed(2)} icon={<Shield className="h-4 w-4" />}
            tooltip="Comme le Sharpe mais ne pénalise que la volatilité baissière." />
          <DataCard title="Calmar Ratio" value={m.calmarRatio.toFixed(2)} icon={<Activity className="h-4 w-4" />}
            tooltip="CAGR / Max Drawdown. Mesure du rendement par rapport à la pire perte." />
          <DataCard title="Omega Ratio" value={m.omegaRatio === Infinity ? '∞' : m.omegaRatio.toFixed(2)}
            icon={<TrendingUp className="h-4 w-4" />} tooltip="Probabilité-pondérée des gains vs pertes au-dessus du seuil." />
          <DataCard title="Profit Factor" value={m.profitFactor.toFixed(2)} icon={<BarChart3 className="h-4 w-4" />}
            tooltip="Profits bruts / pertes brutes. >1.5 considéré comme robuste." />
          <DataCard title="Recovery Factor" value={m.recoveryFactor.toFixed(2)} icon={<Award className="h-4 w-4" />}
            tooltip="Profit total / max drawdown. Capacité à se remettre des pertes." />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-loss" /> Risques & Drawdowns
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DataCard title="Max Drawdown" value={fmtPct(m.maxDrawdownPct)}
            valueClassName="text-loss" icon={<AlertTriangle className="h-4 w-4" />} />
          <DataCard title="Avg Drawdown" value={fmtPct(m.avgDrawdownPct)}
            valueClassName="text-loss" icon={<Activity className="h-4 w-4" />} />
          <DataCard title="Volatilité (ann.)" value={fmtPct(m.volatility)} icon={<Percent className="h-4 w-4" />} />
          <DataCard title="VaR 95%" value={fmtMoney(m.valueAtRisk95)} valueClassName="text-loss"
            icon={<Shield className="h-4 w-4" />} tooltip="Perte maximale attendue à 95% sur un trade." />
          <DataCard title="CVaR 95%" value={fmtMoney(m.conditionalVaR95)} valueClassName="text-loss"
            icon={<Shield className="h-4 w-4" />} tooltip="Perte moyenne dans le pire 5%." />
          <DataCard title="Risk of Ruin" value={fmtPct(m.riskOfRuin)} valueClassName="text-loss"
            icon={<Skull className="h-4 w-4" />} tooltip="Probabilité approximative de ruine selon Kelly." />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" /> Statistiques de trading
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DataCard title="Total Return" value={fmtMoney(m.totalReturn)}
            valueClassName={m.totalReturn >= 0 ? 'text-profit' : 'text-loss'} icon={<TrendingUp className="h-4 w-4" />} />
          <DataCard title="CAGR" value={fmtPct(m.cagr)} icon={<TrendingUp className="h-4 w-4" />} />
          <DataCard title="Win Rate" value={fmtPct(m.winRate)} icon={<Target className="h-4 w-4" />} />
          <DataCard title="Payoff Ratio" value={m.payoffRatio.toFixed(2)} icon={<BarChart3 className="h-4 w-4" />} />
          <DataCard title="Expectancy / trade" value={fmtMoney(m.expectancy)}
            valueClassName={m.expectancy >= 0 ? 'text-profit' : 'text-loss'} icon={<Calculator className="h-4 w-4" />} />
          <DataCard title="Best / Worst" value={`${fmtMoney(m.bestTrade)} / ${fmtMoney(m.worstTrade)}`}
            icon={<Flame className="h-4 w-4" />} />
        </div>
      </section>

      <Card>
        <CardHeader><CardTitle className="text-base">Distribution des rendements par trade</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dist}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bucket" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                formatter={(v: any) => [v, 'Trades']}
              />
              <ReferenceLine x="0" stroke="hsl(var(--border))" />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {dist.map((d, i) => (
                  <Bar key={i} dataKey="count" fill={d.value >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Equity curve & Drawdown sous-jacent</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={equity}>
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="i" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtMoney(v)} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                formatter={(v: any, n) => [fmtMoney(Number(v)), n === 'equity' ? 'Capital' : 'Drawdown']}
              />
              <Area type="monotone" dataKey="equity" stroke="hsl(var(--primary))" fill="url(#eqGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
