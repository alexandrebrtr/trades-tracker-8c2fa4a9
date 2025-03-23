
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requirePremium?: boolean;
}

export const ProtectedRoute = ({ children, requirePremium = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { isPremium, loadingPremium } = usePremium();
  
  // If authentication is loading, show loading state
  if (isLoading || loadingPremium) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
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
