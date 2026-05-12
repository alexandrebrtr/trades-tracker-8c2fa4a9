
-- 1. Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date DESC);

-- 2. Function to recalculate a user's balance from scratch (single source of truth)
CREATE OR REPLACE FUNCTION public.recalculate_user_balance(_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_deposits NUMERIC;
  total_withdrawals NUMERIC;
  total_pnl NUMERIC;
  new_balance NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total_deposits
    FROM public.transactions WHERE user_id = _user_id AND type = 'deposit';
  SELECT COALESCE(SUM(amount), 0) INTO total_withdrawals
    FROM public.transactions WHERE user_id = _user_id AND type = 'withdrawal';
  SELECT COALESCE(SUM(pnl), 0) INTO total_pnl
    FROM public.trades WHERE user_id = _user_id;

  new_balance := total_deposits - total_withdrawals + total_pnl;

  UPDATE public.profiles SET balance = new_balance, updated_at = now() WHERE id = _user_id;
  UPDATE public.portfolios SET balance = new_balance, updated_at = now() WHERE user_id = _user_id;

  RETURN new_balance;
END;
$$;

-- 3. Trigger function for transactions
CREATE OR REPLACE FUNCTION public.handle_transaction_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_user_balance(OLD.user_id);
    RETURN OLD;
  ELSE
    PERFORM public.recalculate_user_balance(NEW.user_id);
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_transactions_balance ON public.transactions;
CREATE TRIGGER trg_transactions_balance
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.handle_transaction_change();

-- 4. Replace the trade balance trigger with one that uses recalculate (keeps portfolios + profiles in sync)
CREATE OR REPLACE FUNCTION public.handle_trade_balance_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_user_balance(OLD.user_id);
    RETURN OLD;
  ELSE
    PERFORM public.recalculate_user_balance(NEW.user_id);
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_trades_balance ON public.trades;
CREATE TRIGGER trg_trades_balance
AFTER INSERT OR UPDATE OR DELETE ON public.trades
FOR EACH ROW EXECUTE FUNCTION public.handle_trade_balance_change();

-- 5. Trigger to auto-update updated_at on transactions
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_transactions_touch ON public.transactions;
CREATE TRIGGER trg_transactions_touch
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 6. Migrate existing portfolio balances into an initial deposit transaction
-- so the recalculation produces the same balance the user already sees.
INSERT INTO public.transactions (user_id, type, amount, date, notes)
SELECT p.user_id, 'deposit', p.balance - COALESCE(t.total_pnl, 0), COALESCE(p.created_at, now()),
       'Capital initial (migration automatique)'
FROM public.portfolios p
LEFT JOIN (
  SELECT user_id, SUM(pnl) AS total_pnl FROM public.trades GROUP BY user_id
) t ON t.user_id = p.user_id
WHERE p.balance IS NOT NULL
  AND (p.balance - COALESCE(t.total_pnl, 0)) > 0
  AND NOT EXISTS (
    SELECT 1 FROM public.transactions tx WHERE tx.user_id = p.user_id
  );

-- 7. Recalculate balances for everyone to ensure consistency
DO $$
DECLARE
  u RECORD;
BEGIN
  FOR u IN SELECT id FROM public.profiles LOOP
    PERFORM public.recalculate_user_balance(u.id);
  END LOOP;
END $$;
