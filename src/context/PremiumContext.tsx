import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { RealtimeService } from '@/services/RealtimeService';
import { UserSettingsService } from '@/services/UserSettingsService';

interface UserSettings {
  theme?: string | {
    primary: string;
    background: string;
    text: string;
    sidebar: string;
    font?: string;
    borderRadius?: string;
    animation?: string;
    buttonStyle?: string;
  };
  notifications?: {
    trades?: boolean;
    news?: boolean;
    alerts?: boolean;
  };
  layout?: {
    compactMode?: boolean;
    showBalances?: boolean;
  };
  broker?: {
    name?: string;
    apiKey?: string;
    secretKey?: string;
    isConnected?: boolean;
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
  userSettings: UserSettings;
  updateUserSettings: (settings: UserSettings) => Promise<void>;
  setPremiumStatus: (status: boolean) => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  premiumSince: null,
  premiumExpires: null,
  loadingPremium: true,
  refreshPremiumStatus: async () => {},
  userSettings: {},
  updateUserSettings: async () => {},
  setPremiumStatus: async () => {},
});

export const usePremium = () => useContext(PremiumContext);

export type { UserSettings }; // Export the UserSettings type

interface PremiumProviderProps {
  children: ReactNode;
}

export const PremiumProvider = ({ children }: PremiumProviderProps) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [premiumSince, setPremiumSince] = useState<string | null>(null);
  const [premiumExpires, setPremiumExpires] = useState<string | null>(null);
  const [loadingPremium, setLoadingPremium] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings>({});

  const adminIds = ['9ce47b0c-0d0a-4834-ae81-e103dff2e386'];
  const isDeveloper = user && adminIds.includes(user.id);

  const updateUserSettings = async (newSettings: UserSettings) => {
    if (!user) return;
    
    try {
      const result = await UserSettingsService.updateUserSettings(user.id, newSettings);
      
      if (result.success) {
        setUserSettings(newSettings);
        
        // Appliquer immédiatement les paramètres de thème
        if (newSettings.theme) {
          UserSettingsService.applyThemeSettings(newSettings.theme);
        }
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  };

  const setPremiumStatus = async (status: boolean) => {
    if (!user) return;
    
    setLoadingPremium(true);
    try {
      const now = new Date();
      const expiryDate = status 
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        : null;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          premium: status,
          premium_since: status ? now.toISOString() : null,
          premium_expires: expiryDate ? expiryDate.toISOString() : null
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsPremium(status);
      setPremiumSince(status ? now.toISOString() : null);
      setPremiumExpires(expiryDate ? expiryDate.toISOString() : null);
      
      console.log(`Premium status updated to: ${status}`);
    } catch (error) {
      console.error('Error updating premium status:', error);
      throw error;
    } finally {
      setLoadingPremium(false);
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
        .select('premium, premium_since, premium_expires, settings')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (isDeveloper) {
        setIsPremium(true);
        setPremiumSince(data.premium_since || new Date().toISOString());
        setPremiumExpires(data.premium_expires || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString());
        setUserSettings(data.settings as UserSettings || {});
        console.log('Developer access granted with premium status');
      } else {
        const now = new Date();
        const expiryDate = data.premium_expires ? new Date(data.premium_expires) : null;
        const isActive = data.premium && expiryDate && expiryDate > now;

        setIsPremium(isActive);
        setPremiumSince(data.premium_since);
        setPremiumExpires(data.premium_expires);
        
        const userSettingsData = data.settings 
          ? data.settings as unknown as UserSettings 
          : { theme: UserSettingsService.defaultTheme };
        
        setUserSettings(userSettingsData);

        console.log('Premium status loaded:', isActive);
      }
      
      if (data.settings) {
        const settings = data.settings as unknown as UserSettings;
        if (settings && settings.theme) {
          UserSettingsService.applyThemeSettings(settings.theme);
        }
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
      setIsPremium(false);
    } finally {
      setLoadingPremium(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = RealtimeService.subscribeToUserSettings(user.id, (settings) => {
      setUserSettings(settings);
    });
    
    return () => {
      unsubscribe();
    };
  }, [user]);

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
        userSettings,
        updateUserSettings,
        setPremiumStatus,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};
