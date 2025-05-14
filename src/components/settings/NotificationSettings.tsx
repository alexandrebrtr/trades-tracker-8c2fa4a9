
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(false);
  const [performanceReports, setPerformanceReports] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Paramètres enregistrés",
      description: "Vos préférences de notification ont été mises à jour."
    });
    
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Gérez vos préférences de notification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col gap-1">
              <span>Notifications par email</span>
              <span className="font-normal text-sm text-muted-foreground">Recevez des mises à jour par email</span>
            </Label>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="app-notifications" className="flex flex-col gap-1">
              <span>Notifications dans l'application</span>
              <span className="font-normal text-sm text-muted-foreground">Recevez des notifications dans l'application</span>
            </Label>
            <Switch 
              id="app-notifications" 
              checked={appNotifications}
              onCheckedChange={setAppNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="market-alerts" className="flex flex-col gap-1">
              <span>Alertes de marché</span>
              <span className="font-normal text-sm text-muted-foreground">Recevez des alertes sur les mouvements de marché</span>
            </Label>
            <Switch 
              id="market-alerts" 
              checked={marketAlerts}
              onCheckedChange={setMarketAlerts}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="performance-reports" className="flex flex-col gap-1">
              <span>Rapports de performance</span>
              <span className="font-normal text-sm text-muted-foreground">Recevez des rapports hebdomadaires sur vos performances</span>
            </Label>
            <Switch 
              id="performance-reports" 
              checked={performanceReports}
              onCheckedChange={setPerformanceReports}
            />
          </div>
        </div>
        
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les préférences
        </Button>
      </CardContent>
    </Card>
  );
}
