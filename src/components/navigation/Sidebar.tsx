
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  BarChart3, 
  Book, 
  Menu,
  X,
  Wallet,
  Shield,
  Contact,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarUserSection } from './SidebarUserSection';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  requirePremium?: boolean;
}

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { user } = useAuth();
  const { isPremium } = usePremium();
  
  // Admin IDs - hardcoded for simplicity
  const adminIds = ['9ce47b0c-0d0a-4834-ae81-e103dff2e386'];
  const isAdmin = user && adminIds.includes(user.id);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check localStorage for saved state on mount
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setCollapsed(JSON.parse(storedState));
    } else {
      setCollapsed(window.innerWidth < 1024);
    }
  }, []);

  // Toggle sidebar state and dispatch event for AppLayout
  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    
    // Save to localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    
    // Dispatch custom event for AppLayout
    const event = new CustomEvent('sidebar-toggle', { 
      detail: { collapsed: newState } 
    });
    window.dispatchEvent(event);
  };

  const navItems: NavItem[] = [
    {
      name: 'Tableau de bord',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Calendrier',
      path: '/calendar',
      icon: <Calendar className="w-5 h-5" />,
      requirePremium: true
    },
    {
      name: 'Nouveau Trade',
      path: '/trade-entry',
      icon: <PlusCircle className="w-5 h-5" />
    },
    {
      name: 'Portefeuille',
      path: '/portfolio',
      icon: <Wallet className="w-5 h-5" />
    },
    {
      name: 'Statistiques',
      path: '/statistics',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      name: 'Journal',
      path: '/journal',
      icon: <Book className="w-5 h-5" />
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: <Contact className="w-5 h-5" />
    }
  ];

  // Add admin item conditionally
  if (isAdmin) {
    navItems.push({
      name: 'Administration',
      path: '/admin',
      icon: <Shield className="w-5 h-5" />
    });
  }

  return (
    <aside 
      className={cn(
        'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-sidebar border-r border-sidebar-border',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center">
              <span className="text-primary font-bold text-xl">Trades Tracker</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={collapsed ? "w-full" : "ml-auto"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={isPremium || !item.requirePremium ? item.path : "/premium"}
                  className={cn(
                    'flex items-center p-3 rounded-md transition-colors',
                    collapsed ? 'justify-center' : 'justify-between',
                    location.pathname === item.path 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {!collapsed && <span className="ml-3 font-medium">{item.name}</span>}
                  </div>
                  
                  {!collapsed && item.requirePremium && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "ml-2 text-xs",
                        isPremium 
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" 
                          : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                      )}
                    >
                      {isPremium ? (
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                          Premium
                        </span>
                      ) : (
                        "Premium"
                      )}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section with dropdown */}
        <SidebarUserSection collapsed={collapsed} />
      </div>
    </aside>
  );
}
