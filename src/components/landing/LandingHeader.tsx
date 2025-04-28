
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Package, BarChart3, Calendar, Book, Phone, Users, FileText, HelpCircle, Star, Video, Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function LandingHeader() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg w-full">
      <div className="w-full px-4 mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-semibold text-primary">
              Trades Tracker
            </Link>
            
            {/* Navigation menu for desktop */}
            {!isMobile && (
              <nav className="flex items-center space-x-6">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-sm text-muted-foreground hover:text-primary data-[state=open]:text-primary">
                        Fonctionnalités
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 w-[400px]">
                          <Link to="/journal" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
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
                            <div className="flex items-center gap-2">
                              <div className="font-medium">Analyses avancées</div>
                              <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Statistiques détaillées de votre trading
                            </p>
                          </Link>
                          <Link to="/calendar" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <Calendar className="h-4 w-4" />
                            <div className="flex items-center gap-2">
                              <div className="font-medium">Calendrier des trades</div>
                              <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Visualisez vos trades dans le temps
                            </p>
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
                          <Link to="/demonstration" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <Video className="h-4 w-4" />
                            <div>
                              <div className="font-medium">Démonstration</div>
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
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-1">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] sm:w-80 pt-16">
                  <div className="flex flex-col space-y-6">
                    <div className="space-y-4">
                      <div className="text-lg font-medium">Fonctionnalités</div>
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Link to="/journal" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                            <Package className="h-4 w-4" />
                            Journal de trading
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/statistics" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                            <BarChart3 className="h-4 w-4" />
                            Analyses avancées
                            <Star className="h-3 w-3 text-yellow-500 ml-1" fill="currentColor" />
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/calendar" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                            <Calendar className="h-4 w-4" />
                            Calendrier
                            <Star className="h-3 w-3 text-yellow-500 ml-1" fill="currentColor" />
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                    
                    <hr className="border-border" />
                    
                    <div className="space-y-2">
                      <SheetClose asChild>
                        <Link to="/premium" className="block p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                          Tarifs
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/blog" className="block p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                          Blog
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/contact" className="block p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                          Contact
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="h-9 w-9"
              aria-label={theme === 'dark' ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Hide login button on very small screens */}
            <Button asChild variant="ghost" size="sm" className="hidden xs:flex">
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
