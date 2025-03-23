
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Journal from "./pages/Journal";
import TradeEntry from "./pages/TradeEntry";
import Portfolio from "./pages/Portfolio";
import Statistics from "./pages/Statistics";
import Calendar from "./pages/Calendar";
import Contact from "./pages/Contact";
import Premium from "./pages/Premium";
import Payment from "./pages/Payment";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PremiumAnalytics from "./pages/PremiumAnalytics";

function App() {
  const { user, isLoading } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  return (
    <div className="app">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
          <Route path="/trade/:id" element={<ProtectedRoute><TradeEntry /></ProtectedRoute>} />
          <Route path="/trade-entry" element={<ProtectedRoute><TradeEntry /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute requirePremium={true}><Calendar /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/statistics" element={<ProtectedRoute requirePremium={true}><Statistics /></ProtectedRoute>} />
          <Route path="/premium-analytics" element={<ProtectedRoute requirePremium={true}><PremiumAnalytics /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
