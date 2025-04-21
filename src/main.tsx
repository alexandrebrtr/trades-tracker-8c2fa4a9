
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/ios.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { PremiumProvider } from './context/PremiumContext'
import { applyIosStyles } from './adapters/iosAdapter'

// Appliquer les styles iOS si nécessaire
applyIosStyles();

// Activer les écouteurs d'événements passifs pour améliorer les performances
if (typeof window !== 'undefined') {
  // Optimisations pour les événements tactiles
  const passiveEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  
  const passiveSupported = () => {
    let passive = false;
    try {
      const options = Object.defineProperty({}, 'passive', {
        get: function() { passive = true; return true; }
      });
      window.addEventListener('test', null as any, options);
      window.removeEventListener('test', null as any, options);
    } catch(err) {}
    return passive;
  };

  // Appliquer des écouteurs passifs si supportés
  if (passiveSupported()) {
    const passiveOption = { passive: true };
    passiveEvents.forEach(event => {
      window.addEventListener(event, () => {}, passiveOption);
    });
  }
}

// Améliorer la gestion des gestes sur appareils mobiles
document.addEventListener('touchmove', (e) => {
  if (e.target instanceof HTMLElement && 
      !e.target.closest('.scrollable-content') && 
      document.documentElement.scrollTop === 0) {
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      e.preventDefault();
    }
  }
}, { passive: false });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          {/* Lien pour accéder directement au contenu pour les utilisateurs de clavier */}
          <a href="#main-content" className="skip-link">
            Passer au contenu
          </a>
          <App />
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
