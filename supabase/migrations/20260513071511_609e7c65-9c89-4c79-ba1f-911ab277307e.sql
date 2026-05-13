
-- Ajout des champs multi-actifs et options à la table trades
ALTER TABLE public.trades
  ADD COLUMN IF NOT EXISTS asset_class TEXT DEFAULT 'crypto',
  ADD COLUMN IF NOT EXISTS instrument_type TEXT,
  ADD COLUMN IF NOT EXISTS quote_currency TEXT,
  ADD COLUMN IF NOT EXISTS market TEXT,
  ADD COLUMN IF NOT EXISTS sector TEXT,
  ADD COLUMN IF NOT EXISTS multiplier NUMERIC DEFAULT 1,
  -- Options-specific fields
  ADD COLUMN IF NOT EXISTS option_type TEXT, -- 'call' | 'put'
  ADD COLUMN IF NOT EXISTS strike NUMERIC,
  ADD COLUMN IF NOT EXISTS expiration TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS implied_volatility NUMERIC, -- en décimal (0.25 = 25%)
  ADD COLUMN IF NOT EXISTS premium NUMERIC,
  ADD COLUMN IF NOT EXISTS contract_size NUMERIC DEFAULT 100,
  ADD COLUMN IF NOT EXISTS risk_free_rate NUMERIC DEFAULT 0.04,
  ADD COLUMN IF NOT EXISTS underlying_price NUMERIC,
  -- Greeks
  ADD COLUMN IF NOT EXISTS delta NUMERIC,
  ADD COLUMN IF NOT EXISTS gamma NUMERIC,
  ADD COLUMN IF NOT EXISTS theta NUMERIC,
  ADD COLUMN IF NOT EXISTS vega NUMERIC,
  ADD COLUMN IF NOT EXISTS rho NUMERIC;

-- Index utiles pour les analyses
CREATE INDEX IF NOT EXISTS idx_trades_asset_class ON public.trades(asset_class);
CREATE INDEX IF NOT EXISTS idx_trades_user_date ON public.trades(user_id, date);
CREATE INDEX IF NOT EXISTS idx_trades_option_type ON public.trades(option_type) WHERE option_type IS NOT NULL;
