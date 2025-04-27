
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function Demonstration() {
  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      <div className="container mx-auto h-[calc(100vh-64px)] px-4">
        <div className="flex items-center justify-center h-full max-w-[1200px] mx-auto">
          <iframe
            className="w-full aspect-video rounded-lg shadow-lg"
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
