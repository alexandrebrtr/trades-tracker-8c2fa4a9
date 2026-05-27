import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DataCard } from '@/components/ui/data-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, RotateCcw, TrendingDown, TrendingUp, Target, Skull, ShieldCheck, Activity } from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar, ReferenceLine, LineChart,
} from 'recharts';
import { runMonteCarlo, paramsFromHistory, MCParams, MCResult, MCMode } from '@/utils/monteCarlo';
import { returnDistribution } from '@/utils/quantStats';
import { useAccount } from '@/context/AccountContext';

interface Props { trades: any[]; initialCapital: number }

const MODES: { value: MCMode; label: string; desc: string }[] = [
  { value: 'historical', label: 'Historique (bootstrap)', desc: 'Rééchantillonnage des PnL réels' },
  { value: 'parametric', label: 'Paramétrique', desc: 'Loi normale sur win/loss params' },
  { value: 'hybrid', label: 'Hybride', desc: 'Historique + bruit & volatilité' },
  { value: 'stress', label: 'Stress test', desc: 'Chocs extrêmes & queue lourde' },
];

export function MonteCarloSimulation({ trades, initialCapital }: Props) {
  const { activeAccount } = useAccount();
  const currency = activeAccount?.currency || 'EUR';
  const fmt = useMemo(() =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }),
  [currency]);
  const fmtNum = (v: number) => Number.isFinite(v) ? fmt.format(v) : '—';

  const auto = useMemo(() => paramsFromHistory(trades, initialCapital), [trades, initialCapital]);
  const [params, setParams] = useState<MCParams>(auto);
  const [result, setResult] = useState<MCResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => { setParams(auto); }, [auto]);

  const run = () => {
    setRunning(true);
    setTimeout(() => {
      try { setResult(runMonteCarlo(params)); } finally { setRunning(false); }
    }, 30);
  };

  useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

  const fanData = useMemo(() => {
    if (!result) return [];
    return result.realistic.map((_, i) => ({
      i,
      p05: result.pessimistic[i],
      p25: result.lowerBand[i],
      p50: result.realistic[i],
      p75: result.upperBand[i],
      p95: result.optimistic[i],
      // stacked areas need diffs
      lo: result.pessimistic[i],
      midLo: result.lowerBand[i] - result.pessimistic[i],
      midHi: result.upperBand[i] - result.lowerBand[i],
      hi: result.optimistic[i] - result.upperBand[i],
    }));
  }, [result]);

  const spaghetti = useMemo(() => {
    if (!result) return [];
    const len = result.realistic.length;
    const data: any[] = [];
    for (let i = 0; i < len; i++) {
      const row: any = { i };
      result.samplePaths.forEach((p, idx) => { row[`s${idx}`] = p[i]; });
      data.push(row);
    }
    return data;
  }, [result]);

  const ddDist = useMemo(() => result ? returnDistribution(result.maxDrawdownDist, 20) : [], [result]);
  const finalDist = useMemo(() => result ? returnDistribution(result.finalEquity, 25) : [], [result]);

  const update = <K extends keyof MCParams>(key: K, value: MCParams[K]) =>
    setParams(p => ({ ...p, [key]: value }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Moteur Monte Carlo avancé
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            4 modes de simulation. Tous les paramètres sont pré-remplis depuis l'historique du compte actif.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs">Mode de simulation</Label>
            <Select value={params.mode} onValueChange={(v) => update('mode', v as MCMode)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MODES.map(m => (
                  <SelectItem key={m.value} value={m.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{m.label}</span>
                      <span className="text-xs text-muted-foreground">{m.desc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Win Rate: <span className="font-semibold">{(params.winRate * 100).toFixed(0)}%</span></Label>
            <Slider min={5} max={95} step={1} value={[params.winRate * 100]} onValueChange={([v]) => update('winRate', v / 100)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Gain moyen: <span className="font-semibold">{fmtNum(params.avgWin)}</span></Label>
            <Slider min={1} max={Math.max(500, Math.round(params.avgWin * 3))} step={1} value={[params.avgWin]} onValueChange={([v]) => update('avgWin', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Perte moyenne: <span className="font-semibold">{fmtNum(params.avgLoss)}</span></Label>
            <Slider min={1} max={Math.max(500, Math.round(params.avgLoss * 3))} step={1} value={[params.avgLoss]} onValueChange={([v]) => update('avgLoss', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Volatilité: <span className="font-semibold">{fmtNum(params.volatility)}</span></Label>
            <Slider min={0} max={Math.max(500, Math.round(params.avgWin * 3))} step={1} value={[params.volatility]} onValueChange={([v]) => update('volatility', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Régime de volatilité: <span className="font-semibold">{(params.volRegime ?? 1).toFixed(2)}x</span></Label>
            <Slider min={0.5} max={3} step={0.1} value={[params.volRegime ?? 1]} onValueChange={([v]) => update('volRegime', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Stress factor: <span className="font-semibold">{(params.stressFactor ?? 1.5).toFixed(2)}x</span></Label>
            <Slider min={1} max={3} step={0.1} value={[params.stressFactor ?? 1.5]} onValueChange={([v]) => update('stressFactor', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Nombre de trades: <span className="font-semibold">{params.trades}</span></Label>
            <Slider min={20} max={1000} step={10} value={[params.trades]} onValueChange={([v]) => update('trades', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Simulations: <span className="font-semibold">{params.simulations}</span></Label>
            <Slider min={100} max={3000} step={100} value={[params.simulations]} onValueChange={([v]) => update('simulations', v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Seuil de ruine: <span className="font-semibold">{params.riskOfRuinThreshold}%</span></Label>
            <Slider min={10} max={90} step={5} value={[params.riskOfRuinThreshold]} onValueChange={([v]) => update('riskOfRuinThreshold', v)} />
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
            <DataCard title="Rendement médian" value={`${result.medianReturn.toFixed(1)}%`}
              valueClassName={result.medianReturn >= 0 ? 'text-profit' : 'text-loss'}
              icon={<TrendingUp className="h-4 w-4" />} />
            <DataCard title="Probabilité de survie" value={`${result.survivalProbability.toFixed(1)}%`}
              valueClassName="text-profit" icon={<ShieldCheck className="h-4 w-4" />} />
            <DataCard title="Risk of Ruin" value={`${result.riskOfRuin.toFixed(1)}%`}
              valueClassName="text-loss" icon={<Skull className="h-4 w-4" />} />
            <DataCard title="P(Drawdown > 25%)" value={`${result.drawdownProbability25.toFixed(1)}%`}
              valueClassName="text-loss" icon={<TrendingDown className="h-4 w-4" />} />
            <DataCard title="VaR 95%" value={fmtNum(result.var95)} valueClassName="text-loss"
              icon={<TrendingDown className="h-4 w-4" />} />
            <DataCard title="CVaR 95%" value={fmtNum(result.cvar95)} valueClassName="text-loss"
              icon={<Target className="h-4 w-4" />} />
            <DataCard title="Meilleur scénario" value={fmtNum(result.bestCase)}
              valueClassName="text-profit" icon={<TrendingUp className="h-4 w-4" />} />
            <DataCard title="Pire scénario" value={fmtNum(result.worstCase)}
              valueClassName="text-loss" icon={<TrendingDown className="h-4 w-4" />} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fan chart — intervalles de confiance (P5 / P25 / P50 / P75 / P95)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart data={fanData}>
                  <defs>
                    <linearGradient id="mcPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="i" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmt.format(v)} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(v: any) => fmt.format(Number(v))} />
                  <Legend />
                  <ReferenceLine y={params.initialCapital} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  <Area dataKey="lo" stackId="band" stroke="transparent" fill="transparent" name="" legendType="none" />
                  <Area dataKey="midLo" stackId="band" stroke="transparent" fill="hsl(var(--primary) / 0.15)" name="P5-P25" />
                  <Area dataKey="midHi" stackId="band" stroke="transparent" fill="hsl(var(--primary) / 0.3)" name="P25-P75" />
                  <Area dataKey="hi" stackId="band" stroke="transparent" fill="hsl(var(--primary) / 0.15)" name="P75-P95" />
                  <Line dataKey="p50" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} name="Médiane" />
                  <Line dataKey="p05" stroke="hsl(var(--loss))" dot={false} strokeWidth={1.5} strokeDasharray="4 3" name="Pessimiste P5" />
                  <Line dataKey="p95" stroke="hsl(var(--profit))" dot={false} strokeWidth={1.5} strokeDasharray="4 3" name="Optimiste P95" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trajectoires Monte Carlo (échantillon)</CardTitle>
              <p className="text-sm text-muted-foreground">20 chemins représentatifs sur {params.simulations} simulations</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={spaghetti}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="i" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmt.format(v)} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <ReferenceLine y={params.initialCapital} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  {Array.from({ length: 20 }).map((_, idx) => (
                    <Line key={idx} dataKey={`s${idx}`} stroke="hsl(var(--primary))" strokeOpacity={0.35}
                      dot={false} strokeWidth={1} isAnimationActive={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Distribution du capital final</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={finalDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="bucket" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <ReferenceLine x={String(Math.round(params.initialCapital))} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Distribution des drawdowns max (%)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={ddDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="bucket" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="count" fill="hsl(var(--loss))" radius={[2, 2, 0, 0]} />
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
