
import { ReactNode, useEffect, useState, lazy, Suspense } from 'react';
import { Header } from '@/components/navigation/Header';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIosAdapter } from '@/adapters/iosAdapter';
import { Capacitor } from '@capacitor/core';

// Chargement paresseux du Sidebar pour améliorer les performances initiales
const Sidebar = lazy(() => import('../navigation/Sidebar').then(mod => ({ default: mod.Sidebar })));

interface AppLayoutProps {
  children: ReactNode;
  allowAnonymous?: boolean;
}

export function AppLayout({ children, allowAnonymous = false }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Utilisation de l'adaptateur iOS
  useIosAdapter();
  
  // Check if the user is allowed to view this page
  const canViewPage = allowAnonymous || user;
  
  useEffect(() => {
    // Vérification de l'état de la sidebar depuis localStorage
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setSidebarCollapsed(JSON.parse(storedState));
    } else {
      // Par défaut, sidebar fermée sur mobile
      setSidebarCollapsed(isMobile);
    }
    
    // Écouter les événements de basculement de sidebar
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
      if (isMobile) {
        setShowMobileMenu(!e.detail.collapsed);
      }
    };
    
    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    };
  }, [isMobile]);

  // Gestion du basculement du menu mobile
  const toggleMobileMenu = () => {
    const newMenuState = !showMobileMenu;
    setShowMobileMenu(newMenuState);
    
    // Mettre à jour l'état de la sidebar pour refléter ce changement
    setSidebarCollapsed(!newMenuState);
    
    // Communiquer le changement au composant Sidebar
    localStorage.setItem('sidebarCollapsed', JSON.stringify(!newMenuState));
    
    const event = new CustomEvent('sidebar-toggle', { 
      detail: { collapsed: !newMenuState } 
    });
    window.dispatchEvent(event);
  };

  // Fonction pour fermer le menu si cliqué en dehors
  const handleOverlayClick = () => {
    if (showMobileMenu && isMobile) {
      toggleMobileMenu();
    }
  };

  // Déterminer si nous sommes sur iOS dans un environnement natif
  const isIosNative = typeof window !== 'undefined' && 
                      Capacitor.isNativePlatform() && 
                      /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className={cn(
      "min-h-screen w-full bg-background overflow-x-hidden",
      isIosNative && "fullscreen-page ios-device"
    )}>
      {/* Bouton de basculement du menu mobile - visible uniquement sur mobile */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center z-40 px-2 sm:px-4 h-10 bg-background/95 backdrop-blur-sm border-b md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 focus-visible:ring-2 focus-visible:ring-primary"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={showMobileMenu}
          aria-controls="sidebar"
        >
          {showMobileMenu ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div className="text-primary font-semibold">
          Trades Tracker
        </div>
        
        {/* Nous rendons maintenant le Header mobile ici */}
        <div className="flex items-center">
          <Header mobileMode={true} />
        </div>
      </div>
      
      {/* Overlay pour fermer le menu quand cliqué à l'extérieur sur mobile */}
      {showMobileMenu && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
      
      <Suspense fallback={null}>
        <Sidebar allowAnonymous={allowAnonymous} />
      </Suspense>
      
      <main 
        className={cn(
          "transition-all duration-300 w-full",
          sidebarCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-64",
          isMobile ? "pt-10" : "pt-0", // Hauteur du header réduite à 10 (40px)
          isMobile ? "ease-in-out" : "",
          isIosNative && "ios-main-content" // Classe spécifique pour le contenu iOS
        )}
        id="main-content"
        role="main"
        aria-label="Contenu principal"
      >
        {!isMobile && <Header />}
        <div className={cn(
          "container py-3 md:py-6 px-3 md:px-6 max-w-7xl mx-auto",
          isMobile && "px-4 py-4"
        )}>
          {canViewPage ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <h1 className="text-2xl font-bold">Connectez-vous pour accéder à cette page</h1>
              <p className="mt-4 text-muted-foreground">
                Vous devez être connecté pour voir ce contenu.
              </p>
              <Button asChild className="mt-8">
                <a href="/login">Se connecter</a>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
}
