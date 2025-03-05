
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
}

const PremiumContext = createContext<PremiumContextProps | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [premiumSince, setPremiumSince] = useState<string | null>(null);
  const [premiumExpires, setPremiumExpires] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for premium status on mount
    const storedStatus = localStorage.getItem('premiumUser');
    if (storedStatus === 'true') {
      setIsPremium(true);
    }

    // Check premium status in profile when user is authenticated
    if (profile) {
      setIsLoading(true);
      checkPremiumStatus(profile);
      setIsLoading(false);
    }
  }, [profile]);

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
      isLoading 
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
