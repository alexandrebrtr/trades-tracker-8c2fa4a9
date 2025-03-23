
-- Function pour mettre à jour automatiquement le solde du profil lorsqu'un trade est ajouté, modifié ou supprimé
CREATE OR REPLACE FUNCTION public.update_profile_balance_on_trade_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le solde du profil en fonction des changements dans les trades
  IF TG_OP = 'INSERT' THEN
    -- Lorsqu'un nouveau trade est ajouté, ajouter son PnL au solde du profil
    UPDATE public.profiles
    SET balance = COALESCE(balance, 0) + COALESCE(NEW.pnl, 0)
    WHERE id = NEW.user_id;
    
    -- Mettre à jour le portefeuille de l'utilisateur également
    UPDATE public.portfolios
    SET balance = COALESCE(balance, 0) + COALESCE(NEW.pnl, 0)
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Lorsqu'un trade est mis à jour, ajuster le solde en soustrayant l'ancien PnL et en ajoutant le nouveau
    UPDATE public.profiles
    SET balance = COALESCE(balance, 0) - COALESCE(OLD.pnl, 0) + COALESCE(NEW.pnl, 0)
    WHERE id = NEW.user_id;
    
    -- Ajuster le portefeuille également
    UPDATE public.portfolios
    SET balance = COALESCE(balance, 0) - COALESCE(OLD.pnl, 0) + COALESCE(NEW.pnl, 0)
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Lorsqu'un trade est supprimé, soustraire son PnL du solde du profil
    UPDATE public.profiles
    SET balance = COALESCE(balance, 0) - COALESCE(OLD.pnl, 0)
    WHERE id = OLD.user_id;
    
    -- Ajuster le portefeuille également
    UPDATE public.portfolios
    SET balance = COALESCE(balance, 0) - COALESCE(OLD.pnl, 0)
    WHERE user_id = OLD.user_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activer la détection des changements en temps réel pour les tables
ALTER TABLE public.trades REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.portfolios REPLICA IDENTITY FULL;

-- Créer un déclencheur pour exécuter la fonction lorsqu'un trade est ajouté, modifié ou supprimé
DROP TRIGGER IF EXISTS on_trade_change ON public.trades;
CREATE TRIGGER on_trade_change
AFTER INSERT OR UPDATE OR DELETE ON public.trades
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_balance_on_trade_change();
