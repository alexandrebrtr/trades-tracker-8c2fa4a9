
-- 1. Create trading_accounts table
CREATE TABLE public.trading_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  broker text,
  currency text NOT NULL DEFAULT 'EUR',
  account_type text NOT NULL DEFAULT 'live' CHECK (account_type IN ('demo','live','paper','prop_firm')),
  initial_capital numeric NOT NULL DEFAULT 0,
  leverage numeric NOT NULL DEFAULT 1,
  profit_target numeric,
  max_drawdown numeric,
  daily_drawdown numeric,
  prop_firm_status text CHECK (prop_firm_status IN ('evaluation','funded','failed','passed')),
  archived boolean NOT NULL DEFAULT false,
  is_default boolean NOT NULL DEFAULT false,
  balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_trading_accounts_user_id ON public.trading_accounts(user_id);

ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own accounts" ON public.trading_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own accounts" ON public.trading_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own accounts" ON public.trading_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own accounts" ON public.trading_accounts FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER trg_trading_accounts_updated_at
BEFORE UPDATE ON public.trading_accounts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2. Add account_id to existing tables
ALTER TABLE public.trades ADD COLUMN account_id uuid;
ALTER TABLE public.transactions ADD COLUMN account_id uuid;
ALTER TABLE public.calendar_events ADD COLUMN account_id uuid;
ALTER TABLE public.custom_charts ADD COLUMN account_id uuid;

CREATE INDEX idx_trades_account_id ON public.trades(account_id);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX idx_calendar_events_account_id ON public.calendar_events(account_id);
CREATE INDEX idx_custom_charts_account_id ON public.custom_charts(account_id);

-- 3. Migrate existing data: create one default account per user with existing trades/transactions
DO $$
DECLARE
  u record;
  new_account_id uuid;
  init_capital numeric;
BEGIN
  FOR u IN
    SELECT DISTINCT user_id FROM (
      SELECT user_id FROM public.trades
      UNION
      SELECT user_id FROM public.transactions
    ) s WHERE user_id IS NOT NULL
  LOOP
    SELECT COALESCE(SUM(amount), 0) INTO init_capital
      FROM public.transactions WHERE user_id = u.user_id AND type = 'deposit';

    INSERT INTO public.trading_accounts (user_id, name, account_type, currency, initial_capital, is_default, balance)
    VALUES (u.user_id, 'Compte principal', 'live', 'EUR', init_capital, true, 0)
    RETURNING id INTO new_account_id;

    UPDATE public.trades SET account_id = new_account_id WHERE user_id = u.user_id AND account_id IS NULL;
    UPDATE public.transactions SET account_id = new_account_id WHERE user_id = u.user_id AND account_id IS NULL;
    UPDATE public.calendar_events SET account_id = new_account_id WHERE user_id = u.user_id AND account_id IS NULL;
    UPDATE public.custom_charts SET account_id = new_account_id WHERE user_id = u.user_id AND account_id IS NULL;
  END LOOP;
END $$;

-- 4. Function: recalculate balance per account
CREATE OR REPLACE FUNCTION public.recalculate_account_balance(_account_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_deposits numeric;
  total_withdrawals numeric;
  total_pnl numeric;
  new_balance numeric;
  acc_user_id uuid;
BEGIN
  IF _account_id IS NULL THEN RETURN 0; END IF;

  SELECT user_id INTO acc_user_id FROM public.trading_accounts WHERE id = _account_id;
  IF acc_user_id IS NULL THEN RETURN 0; END IF;

  SELECT COALESCE(SUM(amount), 0) INTO total_deposits
    FROM public.transactions WHERE account_id = _account_id AND type = 'deposit';
  SELECT COALESCE(SUM(amount), 0) INTO total_withdrawals
    FROM public.transactions WHERE account_id = _account_id AND type = 'withdrawal';
  SELECT COALESCE(SUM(pnl), 0) INTO total_pnl
    FROM public.trades WHERE account_id = _account_id;

  new_balance := total_deposits - total_withdrawals + total_pnl;

  UPDATE public.trading_accounts
    SET balance = new_balance, updated_at = now()
    WHERE id = _account_id;

  -- Keep legacy profile balance = sum of non-archived account balances
  PERFORM set_config('app.bypass_profile_guard', 'on', true);
  UPDATE public.profiles
    SET balance = COALESCE((
      SELECT SUM(balance) FROM public.trading_accounts
      WHERE user_id = acc_user_id AND archived = false
    ), 0),
    updated_at = now()
    WHERE id = acc_user_id;
  PERFORM set_config('app.bypass_profile_guard', 'off', true);

  RETURN new_balance;
END;
$$;

-- 5. Replace trigger handlers to use account_id
CREATE OR REPLACE FUNCTION public.handle_transaction_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_account_balance(OLD.account_id);
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND OLD.account_id IS DISTINCT FROM NEW.account_id THEN
    PERFORM public.recalculate_account_balance(OLD.account_id);
    PERFORM public.recalculate_account_balance(NEW.account_id);
    RETURN NEW;
  ELSE
    PERFORM public.recalculate_account_balance(NEW.account_id);
    RETURN NEW;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_trade_balance_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_account_balance(OLD.account_id);
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND OLD.account_id IS DISTINCT FROM NEW.account_id THEN
    PERFORM public.recalculate_account_balance(OLD.account_id);
    PERFORM public.recalculate_account_balance(NEW.account_id);
    RETURN NEW;
  ELSE
    PERFORM public.recalculate_account_balance(NEW.account_id);
    RETURN NEW;
  END IF;
END;
$$;

-- 6. Ensure triggers exist on trades and transactions
DROP TRIGGER IF EXISTS trg_transactions_balance ON public.transactions;
CREATE TRIGGER trg_transactions_balance
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.handle_transaction_change();

DROP TRIGGER IF EXISTS trg_trades_balance ON public.trades;
CREATE TRIGGER trg_trades_balance
AFTER INSERT OR UPDATE OR DELETE ON public.trades
FOR EACH ROW EXECUTE FUNCTION public.handle_trade_balance_change();

-- 7. Recalculate balances for all migrated accounts
DO $$
DECLARE a record;
BEGIN
  FOR a IN SELECT id FROM public.trading_accounts LOOP
    PERFORM public.recalculate_account_balance(a.id);
  END LOOP;
END $$;
