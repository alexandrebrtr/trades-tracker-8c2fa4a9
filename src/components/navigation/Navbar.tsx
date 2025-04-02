
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  BarChart3, 
  Book, 
  Settings, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  ariaLabel?: string;
}

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update scrolled state based on window scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      ariaLabel: 'Aller au tableau de bord'
    },
    {
      name: 'Calendrier',
      path: '/calendar',
      icon: <Calendar className="w-4 h-4" />,
      ariaLabel: 'Aller au calendrier'
    },
    {
      name: 'Nouveau Trade',
      path: '/trade-entry',
      icon: <PlusCircle className="w-4 h-4" />,
      ariaLabel: 'Créer un nouveau trade'
    },
    {
      name: 'Statistiques',
      path: '/statistics',
      icon: <BarChart3 className="w-4 h-4" />,
      ariaLabel: 'Voir les statistiques'
    },
    {
      name: 'Journal',
      path: '/journal',
      icon: <Book className="w-4 h-4" />,
      ariaLabel: 'Aller au journal'
    },
    {
      name: 'Paramètres',
      path: '/settings',
      icon: <Settings className="w-4 h-4" />,
      ariaLabel: 'Aller aux paramètres'
    }
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300', 
        scrolled 
          ? 'bg-white/90 dark:bg-background/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 z-10" aria-label="Trades Tracker - Accueil">
            <img 
              src="/lovable-uploads/0e632e9a-e44f-4b6e-aab1-8f8757c08470.png" 
              alt="Trades Tracker Logo" 
              className="h-8 w-auto"
              width="32"
              height="32"
            />
            <span className="text-primary font-semibold text-lg sm:text-xl hidden sm:inline-block">
              Trades Tracker
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-1" aria-label="Navigation principale">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                item={item} 
                isActive={location.pathname === item.path} 
              />
            ))}
          </nav>

          {/* Mobile Navigation Trigger */}
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden focus:ring-2 focus:ring-primary"
                  aria-label="Ouvrir le menu"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-12" id="mobile-menu">
                <nav className="flex flex-col space-y-4 mt-8" aria-label="Navigation mobile">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors',
                        location.pathname === item.path 
                          ? 'bg-primary text-white' 
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label={item.ariaLabel}
                      aria-current={location.pathname === item.path ? 'page' : undefined}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}

          {/* User Menu (Simplified) */}
          <div className="flex items-center">
            <button 
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Menu utilisateur"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                T
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
}

function NavLink({ item, isActive }: NavLinkProps) {
  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive 
          ? 'bg-primary text-white' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
      aria-label={item.ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  );
}
