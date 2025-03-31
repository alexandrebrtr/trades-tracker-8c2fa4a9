
import { Navigate } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requirePremium?: boolean;
}

export const ProtectedRoute = ({ children, requirePremium = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { isPremium, loadingPremium } = usePremium();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Set a timer to avoid infinite loading state
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 2000);
    
    // If auth state is already determined, clear the timer
    if (!isLoading) {
      clearTimeout(timer);
      setIsCheckingAuth(false);
    }
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  // If authentication is still loading and we're still checking, show loading state
  if ((isLoading || loadingPremium) && isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Vérification de votre authentification...</p>
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If premium is required but user doesn't have it, redirect to premium page
  if (requirePremium && !isPremium) {
    return <Navigate to="/premium" />;
  }
  
  // User is authenticated and meets premium requirements if needed
  return <>{children}</>;
};
