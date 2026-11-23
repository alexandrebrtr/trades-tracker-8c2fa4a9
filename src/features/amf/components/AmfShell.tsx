import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";
import { BookOpen, GraduationCap, LayoutGrid, Layers, Target } from "lucide-react";

const LINKS = [
  { to: "/amf", label: "Accueil", icon: LayoutGrid, end: true },
  { to: "/amf/cours", label: "Cours", icon: BookOpen },
  { to: "/amf/entrainement", label: "Entraînement", icon: Target },
  { to: "/amf/examen", label: "Examen blanc", icon: GraduationCap },
  { to: "/amf/fiches", label: "Fiches & glossaire", icon: Layers },
];

export function AmfShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <AppLayout>
      <div className="pr-3 md:pr-6 max-w-6xl mx-auto w-full text-left">
        {!hideNav && (
          <nav
            aria-label="Navigation Académie AMF"
            className="mb-6 -mx-1 flex gap-1 overflow-x-auto border-b pb-px scrollbar-thin"
          >
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
        {children}
      </div>
    </AppLayout>
  );
}
