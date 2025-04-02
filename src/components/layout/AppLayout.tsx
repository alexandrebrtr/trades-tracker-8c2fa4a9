
import { ReactNode, useEffect, useState, lazy, Suspense } from 'react';
import { Header } from '@/components/navigation/Header';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lazily load the Sidebar component to improve initial load performance
const Sidebar = lazy(() => import('../navigation/Sidebar').then(mod => ({ default: mod.Sidebar })));

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  useEffect(() => {
    // Check sidebar state from localStorage on mount
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setSidebarCollapsed(JSON.parse(storedState));
    } else {
      // On mobile, start with sidebar collapsed
      setSidebarCollapsed(isMobile);
    }
    
    // Listen for sidebar toggle events from Sidebar component
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

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    // Also update the sidebar state to reflect this
    const newCollapsedState = showMobileMenu;
    setSidebarCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newCollapsedState));
    
    // Dispatch an event to also update the sidebar component
    const event = new CustomEvent('sidebar-toggle', { 
      detail: { collapsed: newCollapsedState } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out pt-14",
          sidebarCollapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"
        )}
        id="main-content"
        role="main"
        aria-label="Contenu principal"
      >
        <Header toggleSidebar={toggleMobileMenu} showMobileMenu={showMobileMenu} />
        <div className={cn(
          "container py-3 md:py-6 px-4 max-w-7xl mx-auto"
        )}>
          {children}
        </div>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
}
