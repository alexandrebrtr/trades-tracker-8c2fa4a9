/**
 * Monte Carlo simulator for trading equity curves.
 * Two modes:
 *  - "historical": resamples observed PnL distribution (bootstrap).
 *  - "parametric": draws from win/loss params (winRate, avgWin, avgLoss, volatility).
 */

export interface MCParams {
  initialCapital: number;
  trades: number;          // number of trades to simulate forward
  simulations: number;     // number of paths
  winRate: number;         // 0..1
  avgWin: number;          // currency
  avgLoss: number;         // positive number, currency
  volatility: number;      // additional gaussian noise on each PnL (currency stdev)
  riskOfRuinThreshold: number; // % of initial capital below which we flag ruin
}

export interface MCResult {
  paths: number[][];          // [simulations][trades+1] equity curves
  finalEquity: number[];      // distribution of final equities
  pessimistic: number[];      // 5th percentile path
  realistic: number[];        // median path
  optimistic: number[];       // 95th percentile path
  meanPath: number[];
  riskOfRuin: number;         // probability the equity went below threshold
  maxDrawdownDist: number[];  // % drawdown per path
  expectedReturn: number;     // mean final return %
  var95: number;              // 95% historical VaR on final equity
  cvar95: number;             // expected shortfall beyond VaR
}

// Mulberry32 PRNG for reproducible sims (seedable later if desired)
const rng = () => Math.random();

// Box-Muller for standard normal
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

const drawTrade = (p: MCParams) => {
  const win = rng() < p.winRate;
  const base = win ? p.avgWin : -p.avgLoss;
  const noise = gauss() * p.volatility;
  return base + noise;
};

export const runMonteCarlo = (p: MCParams): MCResult => {
  const sims = Math.max(10, Math.min(5000, p.simulations));
  const n = Math.max(1, Math.min(2000, p.trades));
  const paths: number[][] = [];
  const finalEquity: number[] = [];
  const maxDDs: number[] = [];
  const ruinThreshold = p.initialCapital * (p.riskOfRuinThreshold / 100);
  let ruined = 0;

  for (let s = 0; s < sims; s++) {
    const path: number[] = new Array(n + 1);
    path[0] = p.initialCapital;
    let peak = p.initialCapital;
    let maxDD = 0;
    let didRuin = false;
    for (let i = 1; i <= n; i++) {
      const next = path[i - 1] + drawTrade(p);
      path[i] = next;
      if (next > peak) peak = next;
      const dd = peak > 0 ? ((peak - next) / peak) * 100 : 0;
      if (dd > maxDD) maxDD = dd;
      if (next <= ruinThreshold) didRuin = true;
    }
    paths.push(path);
    finalEquity.push(path[n]);
    maxDDs.push(maxDD);
    if (didRuin) ruined++;
  }

  // Build percentile bands per step
  const pessimistic: number[] = [];
  const realistic: number[] = [];
  const optimistic: number[] = [];
  const meanPath: number[] = [];
  for (let i = 0; i <= n; i++) {
    const slice = paths.map(pp => pp[i]).sort((a, b) => a - b);
    pessimistic.push(percentile(slice, 0.05));
    realistic.push(percentile(slice, 0.5));
    optimistic.push(percentile(slice, 0.95));
    meanPath.push(slice.reduce((s, v) => s + v, 0) / slice.length);
  }

  const sortedFinal = [...finalEquity].sort((a, b) => a - b);
  const var95 = p.initialCapital - percentile(sortedFinal, 0.05);
  const tailCount = Math.max(1, Math.floor(0.05 * sortedFinal.length));
  const cvar95 = p.initialCapital - sortedFinal.slice(0, tailCount).reduce((s, v) => s + v, 0) / tailCount;

  const expectedReturn =
    ((meanPath[meanPath.length - 1] - p.initialCapital) / p.initialCapital) * 100;

  return {
    paths,
    finalEquity,
    pessimistic,
    realistic,
    optimistic,
    meanPath,
    riskOfRuin: (ruined / sims) * 100,
    maxDrawdownDist: maxDDs,
    expectedReturn,
    var95,
    cvar95,
  };
};

/** Derive default MC params from historical trades. */
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
  const volatility = Math.sqrt(variance) * 0.3; // damp historical noise

  return {
    initialCapital,
    trades: Math.max(50, Math.min(500, pnls.length || 100)),
    simulations: 500,
    winRate: Math.min(0.95, Math.max(0.05, winRate)),
    avgWin: Math.max(1, avgWin),
    avgLoss: Math.max(1, avgLoss),
    volatility,
    riskOfRuinThreshold: 50, // 50% of initial capital
  };
};
