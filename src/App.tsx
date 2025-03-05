import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { PremiumProvider } from "@/context/PremiumContext";
import { AuthProvider } from "@/context/AuthContext";
import { lazy, Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Lazy loaded components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Calendar = lazy(() => import("./pages/Calendar"));
const TradeEntry = lazy(() => import("./pages/TradeEntry"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Journal = lazy(() => import("./pages/Journal"));
const Settings = lazy(() => import("./pages/Settings"));
const Community = lazy(() => import("./pages/Community"));
const Premium = lazy(() => import("./pages/Premium"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const AIChat = lazy(() => import("./pages/AIChat"));
const Profile = lazy(() => import("./pages/Profile"));
const Payment = lazy(() => import("./pages/Payment"));
const Portfolio = lazy(() => import("./pages/Portfolio"));

// Précharger les routes principales
const preloadRoutes = () => {
  import("./pages/Dashboard").catch(console.error);
  import("./pages/Profile").catch(console.error);
  import("./pages/Portfolio").catch(console.error);
};

// LoadingFallback component - plus léger et plus rapide
const LoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

// Configure QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

// RouteTracker component to trigger preloading routes
const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    preloadRoutes();
  }, [location.pathname]);
  
  return null;
};

// Root redirect component (plus efficace)
const Index = () => <Navigate to="/dashboard" replace />;

// Structure hiérarchique réorganisée pour s'assurer que AuthProvider englobe tous les composants nécessitant useAuth
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          <TooltipProvider>
            <BrowserRouter>
              <RouteTracker />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/trade-entry" element={<TradeEntry />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/ai-chat" element={<AIChat />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
