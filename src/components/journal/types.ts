
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
  user_id: string; // Changed from optional to required
  created_at: string; // Changed from optional to required
  updated_at: string; // Changed from optional to required
}
