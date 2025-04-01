
import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    
    const event = new CustomEvent('sidebar-toggle', { 
      detail: { collapsed: newCollapsedState } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu toggle button - only visible on mobile */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
      
      <Sidebar />
      <main className={cn(
        "transition-all duration-300 pt-16 md:pt-0",
        sidebarCollapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64",
        isMobile && "pt-14" // Reduce top padding on mobile
      )}>
        <Header />
        <div className="container py-3 md:py-6 px-3 md:px-4 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
}
