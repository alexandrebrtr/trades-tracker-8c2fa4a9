
export interface Trade {
  id: string;
  date: string;
  symbol: string;
  type: 'long' | 'short';
  entry_price: number;
  exit_price: number;
  size: number;
  pnl: number;
  strategy?: string;
  notes?: string;
  fees?: number;
}
