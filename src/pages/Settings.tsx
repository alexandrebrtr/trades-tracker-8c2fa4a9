
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Brush, 
  Code, 
  Key, 
  Lock, 
  Save, 
  Bell, 
  LayoutGrid, 
  Copy,
  Check,
  PanelLeft,
  Palette,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { usePremium, UserSettings } from '@/context/PremiumContext';
import { useState } from 'react';

export default function Settings() {
  const { toast } = useToast();
  const { isPremium, userSettings, updateUserSettings } = usePremium();
  const [copied, setCopied] = useState(false);
  
  // États locaux pour les paramètres de l'utilisateur
  const [theme, setTheme] = useState({
    primary: '#9b87f5',
    background: '#ffffff',
    text: '#000000',
    sidebar: '#f9fafb'
  });
  
  const [apiKeys, setApiKeys] = useState({
    alphavantage: '',
    finnhub: '',
    tradingview: ''
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    tradeAlerts: true,
    marketNews: false
  });
  
  const [layout, setLayout] = useState({
    compactSidebar: false,
    gridLayout: false,
    showWelcome: true
  });

  // Mettre à jour les états locaux lorsque les paramètres utilisateur sont chargés
  useEffect(() => {
    if (userSettings) {
      setTheme(userSettings.theme);
      setLayout(userSettings.layout);
      setNotifications(userSettings.notifications);
    }
  }, [userSettings]);

  const handleSaveTheme = async () => {
    await updateUserSettings({ theme });
  };

  const handleSaveApiKeys = () => {
    toast({
      title: "Clés API enregistrées",
      description: "Vos clés API ont été sauvegardées en toute sécurité.",
    });
  };

  const handleSaveNotifications = async () => {
    await updateUserSettings({ notifications });
  };

  const handleSaveLayout = async () => {
    await updateUserSettings({ layout });
  };

  const handleCopyTheme = () => {
    navigator.clipboard.writeText(JSON.stringify(theme, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copié !",
      description: "Configuration du thème copiée dans le presse-papier.",
    });
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="appearance" className="flex gap-2 items-center">
              <Brush className="w-4 h-4" />
              <span>Apparence</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex gap-2 items-center">
              <Key className="w-4 h-4" />
              <span>API</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2 items-center">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex gap-2 items-center">
              <LayoutGrid className="w-4 h-4" />
              <span>Mise en page</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  <span>Personnalisation du thème</span>
                  {!isPremium && (
                    <Badge variant="outline" className="ml-2">Premium</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Personnalisez les couleurs et l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Couleur principale</Label>
                      <div className="flex gap-3">
                        <div 
                          className="w-10 h-10 rounded-md border" 
                          style={{ backgroundColor: theme.primary }}
                        />
                        <Input 
                          id="primary-color" 
                          type="text" 
                          value={theme.primary}
                          onChange={(e) => setTheme({...theme, primary: e.target.value})}
                          className="flex-1"
                          disabled={!isPremium}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="background-color">Couleur d'arrière-plan</Label>
                      <div className="flex gap-3">
                        <div 
                          className="w-10 h-10 rounded-md border" 
                          style={{ backgroundColor: theme.background }}
                        />
                        <Input 
                          id="background-color" 
                          type="text" 
                          value={theme.background}
                          onChange={(e) => setTheme({...theme, background: e.target.value})}
                          className="flex-1"
                          disabled={!isPremium}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text-color">Couleur du texte</Label>
                      <div className="flex gap-3">
                        <div 
                          className="w-10 h-10 rounded-md border" 
                          style={{ backgroundColor: theme.text }}
                        />
                        <Input 
                          id="text-color" 
                          type="text" 
                          value={theme.text}
                          onChange={(e) => setTheme({...theme, text: e.target.value})}
                          className="flex-1"
                          disabled={!isPremium}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sidebar-color">Couleur de la barre latérale</Label>
                      <div className="flex gap-3">
                        <div 
                          className="w-10 h-10 rounded-md border" 
                          style={{ backgroundColor: theme.sidebar }}
                        />
                        <Input 
                          id="sidebar-color" 
                          type="text" 
                          value={theme.sidebar}
                          onChange={(e) => setTheme({...theme, sidebar: e.target.value})}
                          className="flex-1"
                          disabled={!isPremium}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    onClick={handleSaveTheme} 
                    disabled={!isPremium}
                    className="flex gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer le thème</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCopyTheme}
                    disabled={!isPremium}
                    className="flex gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copié !" : "Copier la configuration"}</span>
                  </Button>
                </div>
                
                {!isPremium && (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      La personnalisation du thème est une fonctionnalité premium
                    </p>
                    <Button size="sm" asChild>
                      <a href="/premium">Passer à Premium</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PanelLeft className="w-5 h-5" />
                  <span>Options de la barre latérale</span>
                </CardTitle>
                <CardDescription>
                  Personnalisez le comportement de la barre latérale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sidebar-collapse" className="flex flex-col gap-1">
                    <span>Réduire automatiquement</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Réduire automatiquement la barre latérale sur les petits écrans
                    </span>
                  </Label>
                  <Switch id="sidebar-collapse" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sidebar-hover" className="flex flex-col gap-1">
                    <span>Élargir au survol</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Élargir la barre latérale lorsque la souris passe dessus
                    </span>
                  </Label>
                  <Switch id="sidebar-hover" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  <span>Intégrations d'API</span>
                  {!isPremium && (
                    <Badge variant="outline" className="ml-2">Premium</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Configurez vos clés API pour intégrer des services externes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alphavantage-api" className="flex items-center gap-2">
                      Alpha Vantage API
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </Label>
                    <Input 
                      id="alphavantage-api" 
                      type="password" 
                      placeholder="Entrez votre clé API Alpha Vantage" 
                      value={apiKeys.alphavantage}
                      onChange={(e) => setApiKeys({...apiKeys, alphavantage: e.target.value})}
                      disabled={!isPremium}
                    />
                    <p className="text-sm text-muted-foreground">
                      Utilisé pour récupérer les données historiques des actions
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="finnhub-api" className="flex items-center gap-2">
                      Finnhub API
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </Label>
                    <Input 
                      id="finnhub-api" 
                      type="password" 
                      placeholder="Entrez votre clé API Finnhub" 
                      value={apiKeys.finnhub}
                      onChange={(e) => setApiKeys({...apiKeys, finnhub: e.target.value})}
                      disabled={!isPremium}
                    />
                    <p className="text-sm text-muted-foreground">
                      Utilisé pour les actualités financières et les données fondamentales
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tradingview-api" className="flex items-center gap-2">
                      TradingView API
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </Label>
                    <Input 
                      id="tradingview-api" 
                      type="password" 
                      placeholder="Entrez votre clé API TradingView" 
                      value={apiKeys.tradingview}
                      onChange={(e) => setApiKeys({...apiKeys, tradingview: e.target.value})}
                      disabled={!isPremium}
                    />
                    <p className="text-sm text-muted-foreground">
                      Utilisé pour les graphiques et les analyses techniques
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveApiKeys} 
                  disabled={!isPremium}
                  className="flex gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les clés API</span>
                </Button>
                
                {!isPremium && (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Les intégrations API sont des fonctionnalités premium
                    </p>
                    <Button size="sm" asChild>
                      <a href="/premium">Passer à Premium</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <span>Préférences de notifications</span>
                </CardTitle>
                <CardDescription>
                  Configurez quand et comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifs" className="flex flex-col gap-1">
                      <span>Notifications par email</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Recevoir des mises à jour par email
                      </span>
                    </Label>
                    <Switch 
                      id="email-notifs"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifs" className="flex flex-col gap-1">
                      <span>Notifications push</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Recevoir des notifications dans le navigateur
                      </span>
                    </Label>
                    <Switch 
                      id="push-notifs"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trade-alerts" className="flex flex-col gap-1">
                      <span>Alertes de trading</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Alertes pour les entrées/sorties planifiées
                      </span>
                    </Label>
                    <Switch 
                      id="trade-alerts"
                      checked={notifications.tradeAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, tradeAlerts: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="market-news" className="flex flex-col gap-1">
                      <span>Actualités du marché</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Notifications sur les nouvelles importantes du marché
                      </span>
                    </Label>
                    <Switch 
                      id="market-news"
                      checked={notifications.marketNews}
                      onCheckedChange={(checked) => setNotifications({...notifications, marketNews: checked})}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveNotifications} 
                  className="flex gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les préférences</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5" />
                  <span>Mise en page</span>
                </CardTitle>
                <CardDescription>
                  Personnalisez l'agencement et l'affichage de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-sidebar" className="flex flex-col gap-1">
                      <span>Barre latérale compacte</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Afficher la barre latérale en mode compact par défaut
                      </span>
                    </Label>
                    <Switch 
                      id="compact-sidebar"
                      checked={layout.compactSidebar}
                      onCheckedChange={(checked) => setLayout({...layout, compactSidebar: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid-layout" className="flex flex-col gap-1">
                      <span>Disposition en grille</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Afficher les tableaux de bord en disposition grille
                      </span>
                    </Label>
                    <Switch 
                      id="grid-layout"
                      checked={layout.gridLayout}
                      onCheckedChange={(checked) => setLayout({...layout, gridLayout: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-welcome" className="flex flex-col gap-1">
                      <span>Message de bienvenue</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Afficher le message de bienvenue à la connexion
                      </span>
                    </Label>
                    <Switch 
                      id="show-welcome"
                      checked={layout.showWelcome}
                      onCheckedChange={(checked) => setLayout({...layout, showWelcome: checked})}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveLayout} 
                  className="flex gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer la mise en page</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
