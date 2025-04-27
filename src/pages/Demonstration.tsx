
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function Demonstration() {
  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      <div className="h-[calc(100vh-64px)] w-full">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/0f6Y863mHcY"
          title="Démonstration Trades Tracker"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
