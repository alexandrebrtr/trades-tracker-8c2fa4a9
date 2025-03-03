
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // In a real app, you would check for authentication here
  // For now, we're just letting everyone through
  return <>{children}</>;
};
