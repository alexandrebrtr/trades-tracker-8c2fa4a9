import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeSelector } from '@/components/settings/ThemeSelector';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
// Ajoute les importations
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencySelector } from "@/components/portfolio/CurrencySelector";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const location = useLocation();
  
  // Extract tab from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "account" || tab === "preferences" || tab === "notifications") {
      setActiveTab(tab);
    }
  }, [location.search]);
  
  return (
    <AppLayout>
      <div className="page-transition space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Paramètres</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto mb-4">
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-6">
            <CurrencySelector />
            <ThemeSelector />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
