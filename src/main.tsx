
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { PremiumProvider } from './context/PremiumContext'

// Add passive event listeners to touch events for better performance
if (typeof window !== 'undefined') {
  const passiveOption = { passive: true };
  const passiveEvents = ['touchstart', 'touchmove', 'touchend'];
  
  passiveEvents.forEach(event => {
    window.addEventListener(event, () => {}, passiveOption);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          {/* Add skip to content link for keyboard users */}
          <a href="#main-content" className="skip-link">
            Passer au contenu
          </a>
          <App />
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
