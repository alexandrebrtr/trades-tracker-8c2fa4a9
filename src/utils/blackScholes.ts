/**
 * Black-Scholes-Merton option pricing & advanced Greeks for European vanilla options.
 * Inputs: S spot, K strike, T time-to-expiry (years), r risk-free, sigma vol (decimal), q dividend yield.
 */

const SQRT_2PI = Math.sqrt(2 * Math.PI);

const normPdf = (x: number) => Math.exp(-0.5 * x * x) / SQRT_2PI;

// Abramowitz-Stegun approximation of standard normal CDF
const normCdf = (x: number) => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + p * ax);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return 0.5 * (1 + sign * y);
};

export interface Greeks {
  price: number;
  delta: number;
  gamma: number;
  theta: number; // per day
  vega: number;  // per 1% vol move
  rho: number;   // per 1% rate move
  // Higher-order
  charm: number; // dDelta/dT per day
  vanna: number; // dDelta/dVol per 1%
  vomma: number; // dVega/dVol per 1%
  speed: number; // dGamma/dS
  zomma: number; // dGamma/dVol per 1%
  d1: number;
  d2: number;
}

export interface BSInputs {
  S: number; K: number; T: number; r: number; sigma: number;
  q?: number; type: 'call' | 'put';
}

export const blackScholes = ({ S, K, T, r, sigma, q = 0, type }: BSInputs): Greeks => {
  if (S <= 0 || K <= 0 || sigma <= 0 || T <= 0) {
    return { price: 0, delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0,
      charm: 0, vanna: 0, vomma: 0, speed: 0, zomma: 0, d1: 0, d2: 0 };
  }
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;
  const Nd1 = normCdf(d1);
  const Nd2 = normCdf(d2);
  const nd1 = normPdf(d1);
  const eqT = Math.exp(-q * T);
  const erT = Math.exp(-r * T);

  let price = 0, delta = 0, theta = 0, rho = 0, charm = 0;

  if (type === 'call') {
    price = S * eqT * Nd1 - K * erT * Nd2;
    delta = eqT * Nd1;
    theta = (-(S * eqT * nd1 * sigma) / (2 * sqrtT) - r * K * erT * Nd2 + q * S * eqT * Nd1) / 365;
    rho = (K * T * erT * Nd2) / 100;
    charm = (-eqT * (nd1 * (2 * (r - q) * T - d2 * sigma * sqrtT) / (2 * T * sigma * sqrtT) - q * Nd1)) / 365;
  } else {
    price = K * erT * normCdf(-d2) - S * eqT * normCdf(-d1);
    delta = -eqT * normCdf(-d1);
    theta = (-(S * eqT * nd1 * sigma) / (2 * sqrtT) + r * K * erT * normCdf(-d2) - q * S * eqT * normCdf(-d1)) / 365;
    rho = (-K * T * erT * normCdf(-d2)) / 100;
    charm = (-eqT * (nd1 * (2 * (r - q) * T - d2 * sigma * sqrtT) / (2 * T * sigma * sqrtT) + q * normCdf(-d1))) / 365;
  }

  const gamma = (eqT * nd1) / (S * sigma * sqrtT);
  const vega = (S * eqT * nd1 * sqrtT) / 100;
  const vanna = (-eqT * nd1 * d2 / sigma) / 100;
  const vomma = (vega * d1 * d2 / sigma);
  const speed = -gamma * (d1 / (sigma * sqrtT) + 1) / S;
  const zomma = (gamma * (d1 * d2 - 1) / sigma) / 100;

  return { price, delta, gamma, theta, vega, rho, charm, vanna, vomma, speed, zomma, d1, d2 };
};

export const yearsTo = (expiration: string | Date): number => {
  const e = typeof expiration === 'string' ? new Date(expiration) : expiration;
  const ms = e.getTime() - Date.now();
  return Math.max(0, ms / (1000 * 60 * 60 * 24 * 365));
};

/** Payoff at expiry for a single option position. */
export const optionPayoff = (
  S: number, K: number, type: 'call' | 'put', side: 'long' | 'short',
  premium: number, size: number, contractSize: number,
) => {
  const intrinsic = type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
  const direction = side === 'long' ? 1 : -1;
  return (intrinsic - premium) * direction * size * contractSize;
};
