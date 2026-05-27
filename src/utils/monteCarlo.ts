/**
 * Advanced Monte Carlo simulator for trading equity curves.
 * Modes:
 *  - "historical": bootstrap resampling of observed PnL distribution
 *  - "parametric": draws from win/loss params with gaussian noise
 *  - "hybrid": blends bootstrap with parametric noise + volatility regime
 *  - "stress": shocks distribution (fat-tail losses, vol spike)
 */

export type MCMode = 'historical' | 'parametric' | 'hybrid' | 'stress';

export interface MCParams {
  initialCapital: number;
  trades: number;
  simulations: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  volatility: number;
  riskOfRuinThreshold: number; // % of initial capital
  mode: MCMode;
  historicalPnls?: number[];
  volRegime?: number; // multiplier 0.5 .. 3
  stressFactor?: number; // 1..3 (loss tail amplifier)
}

export interface MCResult {
  finalEquity: number[];
  pessimistic: number[];   // P5
  lowerBand: number[];     // P25
  realistic: number[];     // P50
  upperBand: number[];     // P75
  optimistic: number[];    // P95
  meanPath: number[];
  riskOfRuin: number;
  survivalProbability: number;
  drawdownProbability50: number; // probability dd > 50%
  drawdownProbability25: number; // probability dd > 25%
  maxDrawdownDist: number[];
  expectedReturn: number;
  medianReturn: number;
  var95: number;
  cvar95: number;
  bestCase: number;
  worstCase: number;
  samplePaths: number[][]; // a few paths for spaghetti chart
}

const rng = () => Math.random();
const gauss = () => {
  const u = 1 - rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const percentile = (sorted: number[], p: number) => {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)));
  return sorted[idx];
};

const drawTrade = (p: MCParams): number => {
  const vReg = p.volRegime ?? 1;
  const stress = p.stressFactor ?? 1;
  switch (p.mode) {
    case 'historical': {
      const arr = p.historicalPnls && p.historicalPnls.length ? p.historicalPnls : [p.avgWin, -p.avgLoss];
      return arr[Math.floor(rng() * arr.length)];
    }
    case 'parametric': {
      const win = rng() < p.winRate;
      const base = win ? p.avgWin : -p.avgLoss;
      return base + gauss() * p.volatility * vReg;
    }
    case 'hybrid': {
      const arr = p.historicalPnls && p.historicalPnls.length ? p.historicalPnls : [p.avgWin, -p.avgLoss];
      const sample = arr[Math.floor(rng() * arr.length)];
      return sample + gauss() * p.volatility * 0.5 * vReg;
    }
    case 'stress': {
      const win = rng() < Math.max(0.05, p.winRate - 0.1);
      const base = win ? p.avgWin * 0.85 : -p.avgLoss * stress;
      // Occasional fat-tail shock
      const shock = rng() < 0.05 ? -p.avgLoss * stress * 2 : 0;
      return base + gauss() * p.volatility * vReg * 1.5 + shock;
    }
  }
};

export const runMonteCarlo = (p: MCParams): MCResult => {
  const sims = Math.max(50, Math.min(5000, p.simulations));
  const n = Math.max(10, Math.min(2000, p.trades));
  const finalEquity: number[] = [];
  const maxDDs: number[] = [];
  const ruinThreshold = p.initialCapital * (p.riskOfRuinThreshold / 100);
  let ruined = 0;
  let dd50 = 0, dd25 = 0;
  const samplePaths: number[][] = [];

  // Store paths transposed: step-major to compute bands without keeping all
  const stepValues: number[][] = Array.from({ length: n + 1 }, () => []);

  for (let s = 0; s < sims; s++) {
    let eq = p.initialCapital;
    let peak = p.initialCapital;
    let maxDD = 0;
    let didRuin = false;
    stepValues[0].push(eq);
    const path = s < 20 ? [eq] : null;
    for (let i = 1; i <= n; i++) {
      eq += drawTrade(p);
      stepValues[i].push(eq);
      if (path) path.push(eq);
      if (eq > peak) peak = eq;
      const dd = peak > 0 ? ((peak - eq) / peak) * 100 : 0;
      if (dd > maxDD) maxDD = dd;
      if (eq <= ruinThreshold) didRuin = true;
    }
    finalEquity.push(eq);
    maxDDs.push(maxDD);
    if (didRuin) ruined++;
    if (maxDD > 50) dd50++;
    if (maxDD > 25) dd25++;
    if (path) samplePaths.push(path);
  }

  const pessimistic: number[] = [];
  const lowerBand: number[] = [];
  const realistic: number[] = [];
  const upperBand: number[] = [];
  const optimistic: number[] = [];
  const meanPath: number[] = [];
  for (let i = 0; i <= n; i++) {
    const slice = stepValues[i].sort((a, b) => a - b);
    pessimistic.push(percentile(slice, 0.05));
    lowerBand.push(percentile(slice, 0.25));
    realistic.push(percentile(slice, 0.5));
    upperBand.push(percentile(slice, 0.75));
    optimistic.push(percentile(slice, 0.95));
    meanPath.push(slice.reduce((s, v) => s + v, 0) / slice.length);
  }

  const sortedFinal = [...finalEquity].sort((a, b) => a - b);
  const var95 = p.initialCapital - percentile(sortedFinal, 0.05);
  const tailCount = Math.max(1, Math.floor(0.05 * sortedFinal.length));
  const cvar95 = p.initialCapital - sortedFinal.slice(0, tailCount).reduce((s, v) => s + v, 0) / tailCount;
  const expectedReturn = ((meanPath[meanPath.length - 1] - p.initialCapital) / p.initialCapital) * 100;
  const medianReturn = ((realistic[realistic.length - 1] - p.initialCapital) / p.initialCapital) * 100;

  return {
    finalEquity, pessimistic, lowerBand, realistic, upperBand, optimistic, meanPath,
    riskOfRuin: (ruined / sims) * 100,
    survivalProbability: 100 - (ruined / sims) * 100,
    drawdownProbability50: (dd50 / sims) * 100,
    drawdownProbability25: (dd25 / sims) * 100,
    maxDrawdownDist: maxDDs,
    expectedReturn, medianReturn,
    var95, cvar95,
    bestCase: sortedFinal[sortedFinal.length - 1],
    worstCase: sortedFinal[0],
    samplePaths,
  };
};

export const paramsFromHistory = (
  trades: { pnl?: number | null }[],
  initialCapital: number,
): MCParams => {
  const pnls = trades.map(t => Number(t.pnl) || 0).filter(v => Number.isFinite(v));
  const wins = pnls.filter(p => p > 0);
  const losses = pnls.filter(p => p < 0);
  const winRate = pnls.length ? wins.length / pnls.length : 0.5;
  const avgWin = wins.length ? wins.reduce((s, x) => s + x, 0) / wins.length : initialCapital * 0.01;
  const avgLoss = losses.length
    ? Math.abs(losses.reduce((s, x) => s + x, 0) / losses.length)
    : initialCapital * 0.01;
  const m = pnls.length ? pnls.reduce((s, x) => s + x, 0) / pnls.length : 0;
  const variance = pnls.length
    ? pnls.reduce((s, x) => s + (x - m) ** 2, 0) / pnls.length
    : 0;
  const volatility = Math.sqrt(variance) * 0.5;

  return {
    initialCapital,
    trades: Math.max(50, Math.min(500, pnls.length || 100)),
    simulations: 500,
    winRate: Math.min(0.95, Math.max(0.05, winRate)),
    avgWin: Math.max(1, avgWin),
    avgLoss: Math.max(1, avgLoss),
    volatility,
    riskOfRuinThreshold: 50,
    mode: pnls.length >= 20 ? 'hybrid' : 'parametric',
    historicalPnls: pnls,
    volRegime: 1,
    stressFactor: 1.5,
  };
};
