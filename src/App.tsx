
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PremiumProvider } from './context/PremiumContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Calendar from './pages/Calendar';
import Portfolio from './pages/Portfolio';
import TradeEntry from './pages/TradeEntry';
import Statistics from './pages/Statistics';
import PremiumAnalytics from './pages/PremiumAnalytics';
import Settings from './pages/Settings';
import Journal from './pages/Journal';
import Premium from './pages/Premium';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Payment from './pages/Payment';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
              <Route path="/trade-entry" element={<ProtectedRoute><TradeEntry /></ProtectedRoute>} />
              <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
              <Route path="/premium-analytics" element={<ProtectedRoute><PremiumAnalytics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
              <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
