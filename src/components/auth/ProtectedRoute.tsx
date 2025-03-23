
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  requirePremium?: boolean;
}

export const ProtectedRoute = ({ children, requirePremium = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { isPremium, loadingPremium } = usePremium();
  const { toast } = useToast();
  
  // If authentication is loading, show loading state
  if (isLoading || loadingPremium) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If premium is required but user doesn't have it, redirect to premium page with a toast notification
  if (requirePremium && !isPremium) {
    toast({
      title: "Fonctionnalité Premium",
      description: "Cette page est réservée aux utilisateurs premium",
      variant: "default"
    });
    return <Navigate to="/premium" />;
  }
  
  // User is authenticated and meets premium requirements if needed
  return <>{children}</>;
};
