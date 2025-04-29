
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Journal from "./pages/Journal";
import Calendar from "./pages/Calendar";
import Statistics from "./pages/Statistics";
import TradeEntry from "./pages/TradeEntry";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LandingPage from "./pages/LandingPage";
import Blog from "./pages/Blog";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Portfolio from "./pages/Portfolio";
import Payment from "./pages/Payment";
import Premium from "./pages/Premium";
import PremiumAnalytics from "./pages/PremiumAnalytics";
import AdminPanel from "./pages/AdminPanel";
import Demonstration from "./pages/Demonstration";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { PremiumProvider } from "./context/PremiumContext";
import './App.css';
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <PremiumProvider>
            <Router>
              <Routes>
                {/* Landing and public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/demonstration" element={<Demonstration />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/trade-entry" element={<TradeEntry />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/premium-analytics" element={<PremiumAnalytics />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
                
                {/* Fallback routes */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Router>
            
            {/* Toasters */}
            <Toaster />
            <SonnerToaster position="top-right" closeButton richColors />
          </PremiumProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
