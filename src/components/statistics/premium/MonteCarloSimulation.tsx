import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DataCard } from '@/components/ui/data-card';
import { Play, RotateCcw, TrendingDown, TrendingUp, Target, Skull } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar, ReferenceLine,
} from 'recharts';
import { runMonteCarlo, paramsFromHistory, MCParams, MCResult } from '@/utils/monteCarlo';
import { returnDistribution } from '@/utils/quantStats';

interface MonteCarloSimulationProps {
  trades: any[];
  initialCapital: number;
}

const fmt = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

export function MonteCarloSimulation({ trades, initialCapital }: MonteCarloSimulationProps) {
  const auto = useMemo(() => paramsFromHistory(trades, initialCapital), [trades, initialCapital]);
  const [params, setParams] = useState<MCParams>(auto);
  const [result, setResult] = useState<MCResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => { setParams(auto); }, [auto]);

  const run = () => {
    setRunning(true);
    // Defer to next tick to let UI flush
    setTimeout(() => {
      setResult(runMonteCarlo(params));
      setRunning(false);
    }, 50);
  };

  useEffect(() => { run(); /* initial */ /* eslint-disable-next-line */ }, []);

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.realistic.map((_, i) => ({
      i,
      pessimistic: result.pessimistic[i],
      realistic: result.realistic[i],
      optimistic: result.optimistic[i],
    }));
  }, [result]);

  const ddDist = useMemo(() => result ? returnDistribution(result.maxDrawdownDist, 20) : [], [result]);
  const finalDist = useMemo(() => result ? returnDistribution(result.finalEquity, 25) : [], [result]);

  const update = <K extends keyof MCParams>(key: K, value: MCParams[K]) =>
    setParams(p => ({ ...p, [key]: value }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Paramètres de simulation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pré-remplis depuis ton historique réel. Ajuste pour explorer des scénarios « what-if ».
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs">Win Rate: <span className="font-semibold">{(params.winRate * 100).toFixed(0)}%</span></Label>
            <Slider min={5} max={95} step={1} value={[params.winRate * 100]} onValueChange={([v]) => update('winRate', v / 100)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Gain moyen: <span className="font-semibold">{fmt(params.avgWin)}</span></Label>
            <Slider min={1} max={Math.max(500, Math.round(params.avgWin * 3))} step={1} value={[params.avgWin]} onValueChange={([v]) => update('avgWin', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Perte moyenne: <span className="font-semibold">{fmt(params.avgLoss)}</span></Label>
            <Slider min={1} max={Math.max(500, Math.round(params.avgLoss * 3))} step={1} value={[params.avgLoss]} onValueChange={([v]) => update('avgLoss', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Volatilité: <span className="font-semibold">{fmt(params.volatility)}</span></Label>
            <Slider min={0} max={Math.max(500, Math.round(params.avgWin * 2))} step={1} value={[params.volatility]} onValueChange={([v]) => update('volatility', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Nombre de trades: <span className="font-semibold">{params.trades}</span></Label>
            <Slider min={20} max={1000} step={10} value={[params.trades]} onValueChange={([v]) => update('trades', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Simulations: <span className="font-semibold">{params.simulations}</span></Label>
            <Slider min={100} max={3000} step={100} value={[params.simulations]} onValueChange={([v]) => update('simulations', v)} />
          </div>
          <div className="md:col-span-2 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setParams(auto)}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset historique
            </Button>
            <Button onClick={run} disabled={running}>
              <Play className="h-4 w-4 mr-2" /> {running ? 'Calcul...' : 'Lancer la simulation'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <DataCard title="Rendement attendu" value={`${result.expectedReturn.toFixed(1)}%`}
              valueClassName={result.expectedReturn >= 0 ? 'text-profit' : 'text-loss'}
              icon={<TrendingUp className="h-4 w-4" />} />
            <DataCard title="VaR 95%" value={fmt(result.var95)} valueClassName="text-loss"
              icon={<TrendingDown className="h-4 w-4" />} />
            <DataCard title="CVaR 95%" value={fmt(result.cvar95)} valueClassName="text-loss"
              icon={<Target className="h-4 w-4" />} />
            <DataCard title="Risk of Ruin" value={`${result.riskOfRuin.toFixed(1)}%`}
              valueClassName="text-loss" icon={<Skull className="h-4 w-4" />} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projections du capital — bandes pessimiste / réaliste / optimiste</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="i" tick={{ fontSize: 10 }} label={{ value: 'Trade #', position: 'insideBottom', offset: -5, fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmt(v)} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(v: any) => fmt(Number(v))}
                  />
                  <Legend />
                  <ReferenceLine y={params.initialCapital} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  <Line dataKey="optimistic" name="Optimiste (P95)" stroke="hsl(var(--profit))" dot={false} strokeWidth={2} />
                  <Line dataKey="realistic" name="Réaliste (médiane)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} />
                  <Line dataKey="pessimistic" name="Pessimiste (P5)" stroke="hsl(var(--loss))" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Distribution du capital final</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={finalDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="bucket" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Distribution des drawdowns max (%)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ddDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="bucket" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="count" fill="hsl(var(--loss))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
