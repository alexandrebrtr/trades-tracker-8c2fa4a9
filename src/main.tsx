
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { PremiumProvider } from './context/PremiumContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          <App />
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
