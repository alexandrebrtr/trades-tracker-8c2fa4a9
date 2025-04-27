
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Package, BarChart3, Calendar, Book, Phone, Users, FileText, HelpCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function LandingHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-semibold text-primary">
              Trades Tracker
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm text-muted-foreground hover:text-primary data-[state=open]:text-primary">
                      Fonctionnalités
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px]">
                        <Link to="/dashboard" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                          <Package className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Journal de trading</div>
                            <p className="text-sm text-muted-foreground">
                              Suivez vos trades et analysez vos performances
                            </p>
                          </div>
                        </Link>
                        <Link to="/statistics" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                          <BarChart3 className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Analyses avancées</div>
                            <p className="text-sm text-muted-foreground">
                              Statistiques détaillées de votre trading
                            </p>
                          </div>
                        </Link>
                        <Link to="/calendar" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Calendrier des trades</div>
                            <p className="text-sm text-muted-foreground">
                              Visualisez vos trades dans le temps
                            </p>
                          </div>
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link to="/premium" className="text-sm text-muted-foreground hover:text-primary">
                Tarifs
              </Link>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm text-muted-foreground hover:text-primary data-[state=open]:text-primary">
                      Ressources
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px]">
                        <Link to="/blog" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                          <FileText className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Blog</div>
                            <p className="text-sm text-muted-foreground">
                              Articles et guides sur le trading
                            </p>
                          </div>
                        </Link>
                        <Link to="/faq" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                          <HelpCircle className="h-4 w-4" />
                          <div>
                            <div className="font-medium">FAQ</div>
                            <p className="text-sm text-muted-foreground">
                              Réponses aux questions fréquentes
                            </p>
                          </div>
                        </Link>
                        <Link to="/documentation" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                          <Book className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Documentation</div>
                            <p className="text-sm text-muted-foreground">
                              Guide d'utilisation de la plateforme
                            </p>
                          </div>
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm text-muted-foreground hover:text-primary data-[state=open]:text-primary">
                      À propos
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px]">
                        <Link to="/about" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                          <Users className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Notre équipe</div>
                            <p className="text-sm text-muted-foreground">
                              Découvrez qui nous sommes
                            </p>
                          </div>
                        </Link>
                        <Link to="/contact" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                          <Phone className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Nous contacter</div>
                            <p className="text-sm text-muted-foreground">
                              Une question ? Contactez-nous
                            </p>
                          </div>
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="h-9 w-9"
              aria-label={theme === 'dark' ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/dashboard">S'inscrire</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
