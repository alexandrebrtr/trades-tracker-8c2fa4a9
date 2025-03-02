
import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "transition-all duration-300",
        isMobile ? "ml-20" : "ml-64"
      )}>
        <div className="container py-6 max-w-7xl">
          {children}
        </div>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
}
