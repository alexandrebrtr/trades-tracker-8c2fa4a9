
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { AccountSection } from '@/components/settings/AccountSection';
import { PasswordSection } from '@/components/settings/PasswordSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { LayoutDashboard, Palette, Bell, Key, Shield } from 'lucide-react';

export default function Settings() {
  const { user, profile } = useAuth();
  const { userSettings, updateUserSettings } = usePremium();
  const [currentTab, setCurrentTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle saving settings
  const handleSaveSettings = async (settings) => {
    setIsSaving(true);
    try {
      await updateUserSettings(settings);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Définir les onglets disponibles
  const tabs = [
    {
      id: 'profile',
      label: 'Profil',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      id: 'appearance',
      label: 'Apparence',
      icon: <Palette className="h-4 w-4" />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-4 w-4" />
    },
    {
      id: 'password',
      label: 'Mot de passe',
      icon: <Key className="h-4 w-4" />
    },
    {
      id: 'security',
      label: 'Sécurité',
      icon: <Shield className="h-4 w-4" />
    }
  ];

  return (
    <AppLayout>
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <div className="mb-6 bg-muted/40 p-1 rounded-lg inline-block">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="mt-6 space-y-6">
            <TabsContent value="profile" className="mt-0">
              <AccountSection />
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0">
              {userSettings && (
                <AppearanceSettings 
                  userSettings={userSettings} 
                  onSettingsChange={updateUserSettings}
                  onSaveSettings={handleSaveSettings}
                  isSaving={isSaving}
                />
              )}
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Préférences de notifications</h3>
                <p className="text-muted-foreground">
                  Les préférences de notifications seront disponibles dans une prochaine mise à jour.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="password" className="mt-0">
              <PasswordSection />
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <SecuritySection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
}
