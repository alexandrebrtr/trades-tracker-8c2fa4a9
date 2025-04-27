
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function Demonstration() {
  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8 text-center">Démonstration</h1>
        <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto">
          <iframe
            className="w-full h-full rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/0f6Y863mHcY"
            title="Démonstration Trades Tracker"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
