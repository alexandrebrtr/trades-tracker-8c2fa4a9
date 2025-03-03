
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  BarChart3, 
  Book, 
  Users,
  Menu,
  X,
  User,
  CreditCard,
  LogOut,
  Brain,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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
      icon: <Calendar className="w-5 h-5" />
    },
    {
      name: 'Nouveau Trade',
      path: '/trade-entry',
      icon: <PlusCircle className="w-5 h-5" />
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
      name: 'Communauté',
      path: '/community',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Assistant IA',
      path: '/ai-chat',
      icon: <Brain className="w-5 h-5" />
    }
  ];

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
            className="ml-auto"
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
                  to={item.path}
                  className={cn(
                    'flex items-center p-3 rounded-md transition-colors',
                    collapsed ? 'justify-center' : 'justify-start',
                    location.pathname === item.path 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {!collapsed && <span className="ml-3 font-medium">{item.name}</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section with dropdown */}
        <div className="border-t border-sidebar-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={cn(
                "flex items-center cursor-pointer rounded-md p-2 hover:bg-sidebar-accent/50",
                collapsed ? "justify-center" : "space-x-3"
              )}>
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                  T
                </div>
                {!collapsed && (
                  <div className="flex-1">
                    <p className="text-sm font-medium">Trader</p>
                    <p className="text-xs text-sidebar-foreground/70">Compte gratuit</p>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/premium" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Abonnement Premium</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login" className="flex items-center cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
