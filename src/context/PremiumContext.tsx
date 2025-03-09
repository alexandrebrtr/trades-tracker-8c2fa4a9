import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserSettings {
  theme?: string;
  notifications?: {
    trades?: boolean;
    news?: boolean;
    alerts?: boolean;
  };
  layout?: {
    compactMode?: boolean;
    showBalances?: boolean;
  };
}

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  premium: boolean;
  premium_since: string;
  premium_expires: string;
  settings?: UserSettings;
  balance?: number;
  email?: string;
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface PremiumContextType {
  isPremium: boolean;
  premiumSince: string | null;
  premiumExpires: string | null;
  loadingPremium: boolean;
  refreshPremiumStatus: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  premiumSince: null,
  premiumExpires: null,
  loadingPremium: true,
  refreshPremiumStatus: async () => {},
});

export const usePremium = () => useContext(PremiumContext);

interface PremiumProviderProps {
  children: ReactNode;
}

export const PremiumProvider = ({ children }: PremiumProviderProps) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [premiumSince, setPremiumSince] = useState<string | null>(null);
  const [premiumExpires, setPremiumExpires] = useState<string | null>(null);
  const [loadingPremium, setLoadingPremium] = useState(true);

  const loadUserSettings = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return profile?.settings as UserSettings || {};
    } catch (error) {
      console.error('Error loading user settings:', error);
      return {};
    }
  };

  const refreshPremiumStatus = async () => {
    if (!user) {
      setIsPremium(false);
      setPremiumSince(null);
      setPremiumExpires(null);
      setLoadingPremium(false);
      return;
    }

    setLoadingPremium(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('premium, premium_since, premium_expires')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Check if premium and not expired
      const now = new Date();
      const expiryDate = data.premium_expires ? new Date(data.premium_expires) : null;
      const isActive = data.premium && expiryDate && expiryDate > now;

      setIsPremium(isActive);
      setPremiumSince(data.premium_since);
      setPremiumExpires(data.premium_expires);

      console.log('Premium status loaded:', isActive);
    } catch (error) {
      console.error('Error loading premium status:', error);
      setIsPremium(false);
    } finally {
      setLoadingPremium(false);
    }
  };

  useEffect(() => {
    refreshPremiumStatus();
  }, [user]);

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        premiumSince,
        premiumExpires,
        loadingPremium,
        refreshPremiumStatus,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};
