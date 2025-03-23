import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { usePremium, UserSettings } from '@/context/PremiumContext';
import { useTheme } from '@/context/ThemeContext';
import { Bell, Layout, Palette, Shield, User, Key, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ThemeSettings {
  primary: string;
  background: string;
  text: string;
  sidebar: string;
}

interface LayoutSettings {
  compactMode?: boolean;
  showBalances?: boolean;
}

interface NotificationSettings {
  trades?: boolean;
  news?: boolean;
  alerts?: boolean;
}

interface BrokerSettings {
  name?: string;
  apiKey?: string;
  secretKey?: string;
  isConnected?: boolean;
}

export default function Settings() {
  const { userSettings, updateUserSettings } = usePremium();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primary: '#0f172a',
    background: '#ffffff',
    text: '#1e293b',
    sidebar: '#f8fafc'
  });
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    compactMode: false,
    showBalances: true
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    trades: true,
    news: true,
    alerts: true
  });
  const [brokerSettings, setBrokerSettings] = useState<BrokerSettings>({
    name: '',
    apiKey: '',
    secretKey: '',
    isConnected: false
  });
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userSettings) {
      if (userSettings.theme) {
        if (typeof userSettings.theme === 'string') {
          setThemeSettings({
            primary: '#0f172a',
            background: '#ffffff',
            text: '#1e293b',
            sidebar: '#f8fafc'
          });
        } else if (typeof userSettings.theme === 'object') {
          setThemeSettings(userSettings.theme as ThemeSettings);
        }
      }
      
      if (userSettings.layout) {
        setLayoutSettings(userSettings.layout);
      }
      
      if (userSettings.notifications) {
        setNotificationSettings(userSettings.notifications);
      }

      if (userSettings.broker) {
        setBrokerSettings(userSettings.broker);
      }
    }
  }, [userSettings]);

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const newSettings: UserSettings = {
        theme: themeSettings,
        layout: layoutSettings,
        notifications: notificationSettings,
        broker: brokerSettings
      };
      
      await updateUserSettings(newSettings);
      toast({
        title: "Paramètres enregistrés",
        description: "Vos préférences ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos paramètres. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLayoutChange = (key: keyof LayoutSettings, value: boolean) => {
    setLayoutSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBrokerChange = (key: keyof BrokerSettings, value: string | boolean) => {
    setBrokerSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <AppLayout>
      <div className="container py-8 max-w-4xl mx-auto page-transition">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground mt-2">
              Gérez vos préférences et personnalisez votre expérience
            </p>
          </div>

          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full max-w-lg">
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Apparence</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span className="hidden sm:inline">Interface</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="brokers" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Brokers</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Compte</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de l'application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="theme-mode">Mode sombre</Label>
                        <p className="text-sm text-muted-foreground">
                          Basculer entre le mode clair et sombre
                        </p>
                      </div>
                      <Switch 
                        id="theme-mode" 
                        checked={theme === 'dark'} 
                        onCheckedChange={toggleTheme} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label>Couleurs personnalisées</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Personnalisez les couleurs principales de l'interface
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary-color">Couleur principale</Label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              id="primary-color" 
                              value={themeSettings.primary}
                              onChange={(e) => setThemeSettings({...themeSettings, primary: e.target.value})}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <span className="text-sm font-mono">{themeSettings.primary}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="background-color">Arrière-plan</Label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              id="background-color" 
                              value={themeSettings.background}
                              onChange={(e) => setThemeSettings({...themeSettings, background: e.target.value})}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <span className="text-sm font-mono">{themeSettings.background}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="text-color">Texte</Label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              id="text-color" 
                              value={themeSettings.text}
                              onChange={(e) => setThemeSettings({...themeSettings, text: e.target.value})}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <span className="text-sm font-mono">{themeSettings.text}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sidebar-color">Barre latérale</Label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              id="sidebar-color" 
                              value={themeSettings.sidebar}
                              onChange={(e) => setThemeSettings({...themeSettings, sidebar: e.target.value})}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <span className="text-sm font-mono">{themeSettings.sidebar}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout">
              <Card>
                <CardHeader>
                  <CardTitle>Interface</CardTitle>
                  <CardDescription>
                    Personnalisez la disposition et l'affichage de l'interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compact-mode">Mode compact</Label>
                        <p className="text-sm text-muted-foreground">
                          Réduire l'espacement pour afficher plus de contenu
                        </p>
                      </div>
                      <Switch 
                        id="compact-mode" 
                        checked={layoutSettings.compactMode} 
                        onCheckedChange={(checked) => handleLayoutChange('compactMode', checked)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-balances">Afficher les soldes</Label>
                        <p className="text-sm text-muted-foreground">
                          Afficher les montants et soldes dans l'interface
                        </p>
                      </div>
                      <Switch 
                        id="show-balances" 
                        checked={layoutSettings.showBalances} 
                        onCheckedChange={(checked) => handleLayoutChange('showBalances', checked)} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configurez vos préférences de notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="trade-notifications">Notifications de trades</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications pour les trades et transactions
                        </p>
                      </div>
                      <Switch 
                        id="trade-notifications" 
                        checked={notificationSettings.trades} 
                        onCheckedChange={(checked) => handleNotificationChange('trades', checked)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="news-notifications">Actualités financières</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications pour les actualités importantes
                        </p>
                      </div>
                      <Switch 
                        id="news-notifications" 
                        checked={notificationSettings.news} 
                        onCheckedChange={(checked) => handleNotificationChange('news', checked)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="alert-notifications">Alertes de prix</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications pour les alertes de prix
                        </p>
                      </div>
                      <Switch 
                        id="alert-notifications" 
                        checked={notificationSettings.alerts} 
                        onCheckedChange={(checked) => handleNotificationChange('alerts', checked)} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brokers">
              <Card>
                <CardHeader>
                  <CardTitle>API des Brokers</CardTitle>
                  <CardDescription>
                    Connectez vos comptes de trading et configurez vos API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="broker-name">Broker</Label>
                      <select 
                        id="broker-name" 
                        className="w-full p-2 border rounded-md"
                        value={brokerSettings.name || ''}
                        onChange={(e) => handleBrokerChange('name', e.target.value)}
                      >
                        <option value="">Sélectionner un broker</option>
                        <option value="binance">Binance</option>
                        <option value="ftx">FTX</option>
                        <option value="coinbase">Coinbase</option>
                        <option value="kraken">Kraken</option>
                        <option value="mt4">MetaTrader 4</option>
                        <option value="mt5">MetaTrader 5</option>
                        <option value="trading212">Trading 212</option>
                      </select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-key" className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        Clé API
                      </Label>
                      <Input 
                        id="api-key" 
                        type="text" 
                        placeholder="Entrez votre clé API"
                        value={brokerSettings.apiKey || ''}
                        onChange={(e) => handleBrokerChange('apiKey', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        La clé API est requise pour accéder à votre compte de trading.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secret-key" className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Clé Secrète
                      </Label>
                      <Input 
                        id="secret-key" 
                        type="password" 
                        placeholder="Entrez votre clé secrète"
                        value={brokerSettings.secretKey || ''}
                        onChange={(e) => handleBrokerChange('secretKey', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        La clé secrète est nécessaire pour signer vos requêtes API.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="is-connected">État de la connexion</Label>
                        <p className="text-sm text-muted-foreground">
                          {brokerSettings.isConnected 
                            ? "Votre compte est connecté" 
                            : "Votre compte n'est pas connecté"}
                        </p>
                      </div>
                      <Button 
                        onClick={() => {
                          if (brokerSettings.name && brokerSettings.apiKey && brokerSettings.secretKey) {
                            handleBrokerChange('isConnected', true);
                            toast({
                              title: "Compte connecté",
                              description: `Votre compte ${brokerSettings.name} a été connecté avec succès.`
                            });
                          } else {
                            toast({
                              title: "Erreur de connexion",
                              description: "Veuillez remplir tous les champs requis.",
                              variant: "destructive"
                            });
                          }
                        }}
                        variant={brokerSettings.isConnected ? "outline" : "default"}
                      >
                        {brokerSettings.isConnected ? "Reconnecter" : "Connecter"}
                      </Button>
                    </div>

                    <div className="bg-muted p-4 rounded-md mt-4">
                      <h4 className="text-sm font-medium mb-2">Instructions</h4>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-4">
                        <li>Créez une clé API dans votre compte de broker avec des permissions en lecture seule.</li>
                        <li>Copiez la clé API et la clé secrète dans les champs ci-dessus.</li>
                        <li>Cliquez sur "Connecter" pour lier votre compte.</li>
                        <li>Vos trades et soldes seront synchronisés automatiquement.</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Compte et sécurité</CardTitle>
                  <CardDescription>
                    Gérez les paramètres de votre compte et la sécurité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">Mot de passe</h3>
                        <p className="text-sm text-muted-foreground">
                          Dernière modification il y a 3 mois
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">Authentification à deux facteurs</h3>
                        <p className="text-sm text-muted-foreground">
                          Protégez votre compte avec une couche de sécurité supplémentaire
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configurer
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">Sessions actives</h3>
                        <p className="text-sm text-muted-foreground">
                          Gérez les appareils connectés à votre compte
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Gérer
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium text-destructive">Supprimer le compte</h3>
                        <p className="text-sm text-muted-foreground">
                          Supprimer définitivement votre compte et toutes vos données
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Enregistrer les paramètres"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
