
import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check sidebar state from localStorage on mount
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setSidebarCollapsed(JSON.parse(storedState));
    } else {
      setSidebarCollapsed(window.innerWidth < 1024);
    }
    
    // Listen for sidebar toggle events from Sidebar component
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
      localStorage.setItem('sidebarCollapsed', JSON.stringify(e.detail.collapsed));
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <Header />
        <div className="container py-6 max-w-7xl">
          {children}
        </div>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
}
