
import { Navigate } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { toast } from '@/components/ui/use-toast';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isPremium } = usePremium();
  
  useEffect(() => {
    if (!isPremium) {
      toast({
        title: "Accès restreint",
        description: "Cette fonctionnalité nécessite un abonnement premium.",
        variant: "destructive",
      });
    }
  }, [isPremium]);

  if (!isPremium) {
    return <Navigate to="/premium" replace />;
  }

  return <>{children}</>;
};
