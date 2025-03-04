
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirection immédiate sans état intermédiaire
  return <Navigate to="/dashboard" replace />;
};

export default Index;
