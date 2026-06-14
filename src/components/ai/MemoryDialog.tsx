import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemoryDialog({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [riskProfile, setRiskProfile] = useState("");
  const [goals, setGoals] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    supabase
      .from("ai_user_memory" as any)
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) {
          setRiskProfile(data.risk_profile || "");
          setGoals(data.goals || "");
          setPreferences(data.preferences || "");
        }
        setLoading(false);
      });
  }, [open, user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("ai_user_memory" as any)
      .upsert(
        {
          user_id: user.id,
          risk_profile: riskProfile,
          goals,
          preferences,
        } as any,
        { onConflict: "user_id" }
      );
    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Mémoire enregistrée", description: "L'IA utilisera ces informations dans ses réponses." });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Mémoire de l'IA</DialogTitle>
          <DialogDescription>
            Ces informations sont stockées de façon sécurisée et permettent à l'IA de personnaliser ses analyses pour vous.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="risk">Profil de risque</Label>
              <Input
                id="risk"
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                placeholder="Ex : Modéré, prudent, agressif…"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goals">Objectifs financiers</Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Ex : Passer mon challenge FTMO en 2 mois, atteindre 10% de rendement annuel…"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prefs">Préférences</Label>
              <Textarea
                id="prefs"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Ex : Je préfère les actions tech et les ETF, j'évite les cryptos…"
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={save} disabled={saving || loading}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
