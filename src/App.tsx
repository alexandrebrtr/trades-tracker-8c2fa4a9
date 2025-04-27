
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Loader2 } from 'lucide-react';

// Import Dashboard directement pour éviter les problèmes de chargement dynamique
import Dashboard from "./pages/Dashboard";

// Chargement des pages avec lazy loading pour améliorer les performances
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Journal = lazy(() => import("./pages/Journal"));
const TradeEntry = lazy(() => import("./pages/TradeEntry"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Contact = lazy(() => import("./pages/Contact"));
const Premium = lazy(() => import("./pages/Premium"));
const Payment = lazy(() => import("./pages/Payment"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PremiumAnalytics = lazy(() => import("./pages/PremiumAnalytics"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Team = lazy(() => import("./pages/Team"));
const Blog = lazy(() => import("./pages/Blog"));
const Demonstration = lazy(() => import("./pages/Demonstration"));

// Composant de chargement
function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}

// Composant pour faire défiler vers le haut lors des changements de page
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { user, isLoading } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/demonstration" element={<Demonstration />} />
            <Route path="/about" element={<Team />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faq" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Routes protégées */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/trade/:id" element={<ProtectedRoute><TradeEntry /></ProtectedRoute>} />
            <Route path="/trade-entry" element={<ProtectedRoute><TradeEntry /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute requirePremium={true}><Calendar /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/statistics" element={<ProtectedRoute requirePremium={true}><Statistics /></ProtectedRoute>} />
            <Route path="/premium-analytics" element={<ProtectedRoute requirePremium={true}><PremiumAnalytics /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
