
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface PremiumContextProps {
  isPremium: boolean;
  setPremiumStatus: (status: boolean) => void;
}

const PremiumContext = createContext<PremiumContextProps | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState<boolean>(false);

  useEffect(() => {
    // Check localStorage for premium status on mount
    const storedStatus = localStorage.getItem('premiumUser');
    if (storedStatus === 'true') {
      setIsPremium(true);
    }
  }, []);

  const setPremiumStatus = (status: boolean) => {
    setIsPremium(status);
    localStorage.setItem('premiumUser', status.toString());
  };

  return (
    <PremiumContext.Provider value={{ isPremium, setPremiumStatus }}>
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
