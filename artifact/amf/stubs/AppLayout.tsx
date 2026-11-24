import { ReactNode } from "react";
import { GraduationCap } from "lucide-react";

/** Mise en page autonome utilisée à la place de l'AppLayout de Trades Tracker. */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="amf-page">
      <header className="amf-brand">
        <span className="amf-brand-mark" aria-hidden="true">
          <GraduationCap className="h-4 w-4" />
        </span>
        <span className="font-semibold tracking-tight">Académie AMF</span>
        <span className="hidden sm:inline text-xs text-muted-foreground">Préparation à l'examen certifié</span>
      </header>
      <main>{children}</main>
    </div>
  );
}
