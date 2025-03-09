
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface PremiumContextProps {
  isPremium: boolean;
  setPremiumStatus: (status: boolean) => Promise<void>;
  premiumSince: string | null;
  premiumExpires: string | null;
  isLoading: boolean;
  userSettings: UserSettings | null;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

export interface UserSettings {
  theme: {
    primary: string;
    background: string;
    text: string;
    sidebar: string;
  };
  layout: {
    compactSidebar: boolean;
    gridLayout: boolean;
    showWelcome: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    tradeAlerts: boolean;
    marketNews: boolean;
  };
}

const defaultSettings: UserSettings = {
  theme: {
    primary: '#9b87f5',
    background: '#ffffff',
    text: '#000000',
    sidebar: '#f9fafb'
  },
  layout: {
    compactSidebar: false,
    gridLayout: false,
    showWelcome: true
  },
  notifications: {
    email: true,
    push: false,
    tradeAlerts: true,
    marketNews: false
  }
};

const PremiumContext = createContext<PremiumContextProps | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [premiumSince, setPremiumSince] = useState<string | null>(null);
  const [premiumExpires, setPremiumExpires] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check premium status in profile when user is authenticated
    if (profile) {
      setIsLoading(true);
      checkPremiumStatus(profile);
      loadUserSettings();
      setIsLoading(false);
    }
  }, [profile]);

  // Set up real-time updates for profile changes
  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time changes on the profiles table
    const channel = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          // When a profile update is detected, refresh the profile data
          console.log('Profile update detected:', payload);
          refreshProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshProfile]);

  const checkPremiumStatus = (profile: any) => {
    if (profile.premium) {
      setIsPremium(true);
      setPremiumSince(profile.premium_since || null);
      setPremiumExpires(profile.premium_expires || null);
      
      // Save premium status to localStorage
      localStorage.setItem('premiumUser', 'true');
      
      // Check if premium subscription has expired
      if (profile.premium_expires) {
        const expiryDate = new Date(profile.premium_expires);
        const today = new Date();
        
        if (today > expiryDate) {
          setIsPremium(false);
          localStorage.setItem('premiumUser', 'false');
        }
      }
    } else {
      setIsPremium(false);
      setPremiumSince(null);
      setPremiumExpires(null);
      localStorage.setItem('premiumUser', 'false');
    }
  };

  const loadUserSettings = async () => {
    if (!user) return;
    
    try {
      // Essayer de charger depuis localStorage d'abord (pour des performances)
      const savedSettings = localStorage.getItem(`userSettings_${user.id}`);
      if (savedSettings) {
        setUserSettings(JSON.parse(savedSettings));
      }
      
      // Chercher les paramètres dans la base de données
      const { data, error } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        // Si pas de paramètres en base, utiliser les valeurs par défaut
        if (!savedSettings) {
          setUserSettings(defaultSettings);
        }
        return;
      }
      
      if (data && data.settings) {
        // Fusionner avec les paramètres par défaut pour s'assurer que toutes les propriétés existent
        const mergedSettings = {
          ...defaultSettings,
          ...data.settings
        };
        
        setUserSettings(mergedSettings);
        // Mettre à jour le localStorage
        localStorage.setItem(`userSettings_${user.id}`, JSON.stringify(mergedSettings));
      } else if (!savedSettings) {
        // Pas de paramètres en base ou en local, initialiser avec les valeurs par défaut
        setUserSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres utilisateur:', error);
      // En cas d'erreur, utiliser les paramètres par défaut si rien n'est chargé
      if (!userSettings) {
        setUserSettings(defaultSettings);
      }
    }
  };

  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user || !userSettings) return;
    
    try {
      // Mettre à jour l'état local
      const updatedSettings = {
        ...userSettings,
        ...newSettings
      };
      
      setUserSettings(updatedSettings);
      
      // Mettre à jour le localStorage
      localStorage.setItem(`userSettings_${user.id}`, JSON.stringify(updatedSettings));
      
      // Mettre à jour la base de données
      const { error } = await supabase
        .from('profiles')
        .update({
          settings: updatedSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Paramètres enregistrés",
        description: "Vos préférences ont été mises à jour avec succès.",
      });
      
      return;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des paramètres:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour des paramètres",
        variant: "destructive"
      });
    }
  };

  const setPremiumStatus = async (status: boolean) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier votre abonnement",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + (status ? 1 : 0)); // 1 month expiry for premium
      
      // Update premium status and expiry in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          premium: status,
          premium_since: status ? now.toISOString() : null,
          premium_expires: status ? expiryDate.toISOString() : null,
          updated_at: now.toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // If setting to premium, reduce balance by the premium price
      if (status && profile && profile.balance) {
        const price = 9.99; // Default to monthly price
        const newBalance = parseFloat(profile.balance) - price;
        
        const { error: balanceError } = await supabase
          .from('profiles')
          .update({
            balance: newBalance >= 0 ? newBalance : 0
          })
          .eq('id', user.id);
        
        if (balanceError) {
          console.error("Error updating balance:", balanceError);
        }
      }
      
      // Update local state
      setIsPremium(status);
      setPremiumSince(status ? now.toISOString() : null);
      setPremiumExpires(status ? expiryDate.toISOString() : null);
      
      // Update localStorage
      localStorage.setItem('premiumUser', status.toString());
      
      // Refresh profile data
      await refreshProfile();
      
      toast({
        title: status ? "Abonnement activé" : "Abonnement désactivé",
        description: status 
          ? "Vous avez maintenant accès aux fonctionnalités premium."
          : "Votre abonnement premium a été désactivé.",
      });
    } catch (error: any) {
      console.error("Error updating premium status:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour de l'abonnement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PremiumContext.Provider value={{ 
      isPremium, 
      setPremiumStatus, 
      premiumSince, 
      premiumExpires, 
      isLoading,
      userSettings,
      updateUserSettings
    }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}
