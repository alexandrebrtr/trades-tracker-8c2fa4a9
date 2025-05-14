
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Statistics from './pages/Statistics';
import Premium from './pages/Premium';
import Settings from './pages/Settings';
import PremiumAnalytics from './pages/PremiumAnalytics';
import { AuthProvider } from './context/AuthContext';
import { PremiumProvider } from './context/PremiumContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { CurrencyContext, useInitCurrencySettings } from './hooks/useCurrencySettings';

const queryClient = new QueryClient();

function App() {
  const currencySettings = useInitCurrencySettings();
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CurrencyContext.Provider value={currencySettings}>
        <BrowserRouter>
          <AuthProvider>
            <PremiumProvider>
              <QueryClientProvider client={queryClient}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/premium-analytics" element={<PremiumAnalytics />} />
                </Routes>
                <Toaster />
              </QueryClientProvider>
            </PremiumProvider>
          </AuthProvider>
        </BrowserRouter>
      </CurrencyContext.Provider>
    </ThemeProvider>
  );
}

export default App;
