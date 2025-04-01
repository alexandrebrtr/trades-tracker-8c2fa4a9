
import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
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
    };
    
    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "transition-all duration-300 pt-16 md:pt-0",
        sidebarCollapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"
      )}>
        <Header />
        <div className="container py-4 md:py-6 px-4 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
}
