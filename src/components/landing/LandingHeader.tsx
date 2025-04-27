
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-semibold text-primary">
              Trades Tracker
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/features" className="text-sm text-muted-foreground hover:text-primary">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary">
                Tarifs
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
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
