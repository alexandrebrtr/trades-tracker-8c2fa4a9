
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PremiumContextProps {
  isPremium: boolean;
  setPremiumStatus: (status: boolean) => void;
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
  const { user, profile } = useAuth();

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
    setIsPremium(status);
    localStorage.setItem('premiumUser', status.toString());
    
    // Update profile if user is logged in
    if (user) {
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1); // Default to 1 month expiry
      
      try {
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
          console.error('Error updating premium status:', error);
        } else {
          setPremiumSince(status ? now.toISOString() : null);
          setPremiumExpires(status ? expiryDate.toISOString() : null);
        }
      } catch (error) {
        console.error('Error updating premium status:', error);
      }
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
