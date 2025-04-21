
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Capacitor } from '@capacitor/core';

/**
 * Hook pour adapter l'application au comportement iOS
 */
export const useIosAdapter = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Vérifier si l'application s'exécute dans un environnement Capacitor/iOS
    const isCapacitorEnvironment = Capacitor.isNativePlatform();
    
    if (isCapacitorEnvironment) {
      // Adaptation aux gestes iOS (swipe back, etc.)
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      // Écouter les événements de cycle de vie iOS
      window.addEventListener('statusTap', () => {
        // Faire défiler la page vers le haut lorsque l'utilisateur touche la barre d'état
        scrollToTop();
      });
      
      // Gérer le retour arrière avec le bouton matériel sur iOS
      document.addEventListener('ionBackButton', (ev: any) => {
        ev.detail.register(10, () => {
          if (window.location.pathname !== '/dashboard' && window.location.pathname !== '/') {
            window.history.back();
          } else {
            // Utiliser la méthode appropriée de Capacitor pour quitter l'application
            if (Capacitor.isNativePlatform()) {
              // Cette action sera traitée par le plugin natif
              document.dispatchEvent(new CustomEvent('exitApp'));
            }
          }
        });
      });
    }
    
    return () => {
      if (isCapacitorEnvironment) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isMobile]);
};

// Fonction utilitaire pour faire défiler vers le haut
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Gestion du toucher pour le swipe back iOS
let touchStartX = 0;
const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!e.target) return;
  
  // Vérifier si nous sommes dans un élément défilable
  const isScrollableElement = (e.target as HTMLElement).closest('.scrollable-content');
  
  // Swipe depuis le bord gauche pour retourner en arrière (comportement iOS)
  const touchX = e.touches[0].clientX;
  if (touchX - touchStartX > 50 && touchStartX < 30 && window.history.length > 1) {
    e.preventDefault();
    window.history.back();
  }
  
  // Empêcher le défilement du body lorsqu'on est à la racine et que le défilement n'est pas nécessaire
  if (!isScrollableElement && document.documentElement.scrollTop === 0) {
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      e.preventDefault();
    }
  }
};

/**
 * Adapte l'apparence de l'application pour iOS
 */
export const applyIosStyles = () => {
  // Application des styles spécifiques à iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    document.documentElement.classList.add('ios-device');
  }
};
