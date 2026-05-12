
-- =========================================================================
-- 1. Prevent privilege escalation on profiles (premium/balance/banned)
-- =========================================================================

CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow internal server-side processes (triggers, edge functions using
  -- service_role, or our own balance recalculation) to bypass the guard
  -- by setting a session-local config flag.
  IF current_setting('app.bypass_profile_guard', true) = 'on' THEN
    RETURN NEW;
  END IF;

  -- Force protected columns back to their previous values so a regular
  -- authenticated user cannot grant themselves premium, alter balance,
  -- unban themselves or inflate their trades_count.
  NEW.premium := OLD.premium;
  NEW.premium_since := OLD.premium_since;
  NEW.premium_expires := OLD.premium_expires;
  NEW.banned := OLD.banned;
  NEW.banned_at := OLD.banned_at;
  NEW.balance := OLD.balance;
  NEW.trades_count := OLD.trades_count;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_prevent_escalation ON public.profiles;
CREATE TRIGGER trg_profiles_prevent_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- Update balance recalculation to bypass the guard since it is the
-- legitimate, server-side source of truth for the balance column.
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

  PERFORM set_config('app.bypass_profile_guard', 'on', true);
  UPDATE public.profiles SET balance = new_balance, updated_at = now() WHERE id = _user_id;
  PERFORM set_config('app.bypass_profile_guard', 'off', true);

  UPDATE public.portfolios SET balance = new_balance, updated_at = now() WHERE user_id = _user_id;

  RETURN new_balance;
END;
$$;

-- Same for the legacy update_profile_balance_on_trade_change in case it
-- still fires anywhere (kept for safety, harmless if unused).
CREATE OR REPLACE FUNCTION public.update_profile_balance_on_trade_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('app.bypass_profile_guard', 'on', true);
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET balance = COALESCE(balance, 0) + COALESCE(NEW.pnl, 0) WHERE id = NEW.user_id;
    PERFORM set_config('app.bypass_profile_guard', 'off', true);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.profiles SET balance = COALESCE(balance, 0) - COALESCE(OLD.pnl, 0) + COALESCE(NEW.pnl, 0) WHERE id = NEW.user_id;
    PERFORM set_config('app.bypass_profile_guard', 'off', true);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET balance = COALESCE(balance, 0) - COALESCE(OLD.pnl, 0) WHERE id = OLD.user_id;
    PERFORM set_config('app.bypass_profile_guard', 'off', true);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- handle_new_user also writes premium fields, so make sure it bypasses too
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('app.bypass_profile_guard', 'on', true);
  INSERT INTO public.profiles (
    id, username, premium, premium_since, premium_expires
  )
  VALUES (
    NEW.id, NEW.email, true, now(),
    '2025-12-31 23:59:59+00'::timestamp with time zone
  );
  PERFORM set_config('app.bypass_profile_guard', 'off', true);
  RETURN NEW;
END;
$$;

-- =========================================================================
-- 2. Ratings table — require auth + bind to user_id (one rating per user)
-- =========================================================================

ALTER TABLE public.ratings ADD COLUMN IF NOT EXISTS user_id UUID;
CREATE UNIQUE INDEX IF NOT EXISTS ratings_user_id_unique ON public.ratings(user_id) WHERE user_id IS NOT NULL;

DROP POLICY IF EXISTS "Allow public insert access to ratings" ON public.ratings;
DROP POLICY IF EXISTS "Allow public read access to ratings" ON public.ratings;

CREATE POLICY "Authenticated users can insert their own rating"
  ON public.ratings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read ratings"
  ON public.ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own rating"
  ON public.ratings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rating"
  ON public.ratings FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- =========================================================================
-- 3. Remove contact_messages from realtime publication (sensitive emails)
-- =========================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contact_messages'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.contact_messages';
  END IF;
END $$;

-- =========================================================================
-- 4. Lock down SECURITY DEFINER helper functions — only triggers should call them
-- =========================================================================

REVOKE EXECUTE ON FUNCTION public.recalculate_user_balance(UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_transaction_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_trade_balance_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_profile_balance_on_trade_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_profile_privilege_escalation() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- =========================================================================
-- 5. Ensure all custom functions have an explicit search_path
-- =========================================================================

ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.handle_transaction_change() SET search_path = public;
ALTER FUNCTION public.handle_trade_balance_change() SET search_path = public;
