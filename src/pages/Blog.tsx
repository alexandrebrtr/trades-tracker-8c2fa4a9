
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function Blog() {
  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg text-muted-foreground">
            Bientôt disponible : Des articles sur le trading et la gestion de portefeuille.
          </p>
        </div>
      </div>
    </div>
  );
}
