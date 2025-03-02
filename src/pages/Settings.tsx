
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  CreditCard, 
  Download, 
  Key, 
  LogOut, 
  Mail, 
  PenBox, 
  Share2, 
  Shield, 
  User 
} from 'lucide-react';

export default function Settings() {
  return (
    <AppLayout>
      <div className="page-transition space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez votre profil, vos préférences et les paramètres de sécurité.
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted p-1 grid grid-cols-2 md:grid-cols-4 lg:flex">
            <TabsTrigger value="profile" className="flex gap-2 items-center">
              <User className="w-4 h-4" /> 
              <span className="sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex gap-2 items-center">
              <PenBox className="w-4 h-4" /> 
              <span className="sm:inline">Compte</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2 items-center">
              <Bell className="w-4 h-4" /> 
              <span className="sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex gap-2 items-center">
              <Shield className="w-4 h-4" /> 
              <span className="sm:inline">Sécurité</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et votre profil public.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="space-y-1">
                    <div className="relative mx-auto w-32 h-32 rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden">
                      <span className="text-4xl font-semibold text-muted-foreground">T</span>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm">Modifier</Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" placeholder="Votre nom" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Nom d'utilisateur</Label>
                        <Input id="username" placeholder="@username" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">À propos de moi</Label>
                      <Input id="bio" placeholder="Trader depuis 2020, spécialisé en swing trading" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Profil public</h3>
                    <p className="text-sm text-muted-foreground">
                      Ces informations seront affichées publiquement dans la communauté.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="public-stats">Statistiques de trading</Label>
                        <p className="text-xs text-muted-foreground">
                          Partager vos performances avec la communauté
                        </p>
                      </div>
                      <Switch id="public-stats" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="public-trades">Trades récents</Label>
                        <p className="text-xs text-muted-foreground">
                          Montrer vos 5 derniers trades dans votre profil
                        </p>
                      </div>
                      <Switch id="public-trades" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Enregistrer les modifications</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
                <CardDescription>
                  Gérez vos préférences d'affichage et les paramètres généraux.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Langue</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuseau horaire</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                        <option value="America/New_York">America/New York (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Exportation des données</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex gap-2">
                      <Download className="w-4 h-4" />
                      Exporter en CSV
                    </Button>
                    <Button variant="outline" className="flex gap-2">
                      <Download className="w-4 h-4" />
                      Exporter en PDF
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-destructive">Actions dangereuses</h3>
                  <Button variant="destructive">Supprimer le compte</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configurez les notifications que vous souhaitez recevoir.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Notifications par email</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Résumé hebdomadaire</Label>
                          <p className="text-xs text-muted-foreground">
                            Recevez un résumé de vos performances chaque semaine
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Alertes de prix</Label>
                          <p className="text-xs text-muted-foreground">
                            Notifications quand un actif atteint un prix cible
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Objectifs atteints</Label>
                          <p className="text-xs text-muted-foreground">
                            Notifications quand vous atteignez vos objectifs
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Notifications dans l'application</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Rappels de trading</Label>
                          <p className="text-xs text-muted-foreground">
                            Rappels pour suivre votre plan de trading
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Commentaires sur vos trades</Label>
                          <p className="text-xs text-muted-foreground">
                            Notifications quand la communauté commente vos trades
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Actualités marché</Label>
                          <p className="text-xs text-muted-foreground">
                            Notifications sur les événements importants du marché
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Enregistrer les préférences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Gérez la sécurité de votre compte et vos informations de connexion.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Changement de mot de passe</h3>
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Mot de passe actuel</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nouveau mot de passe</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button className="mt-2">Mettre à jour le mot de passe</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Authentification à deux facteurs</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ajoutez une couche de sécurité supplémentaire à votre compte.
                    </p>
                    <Button variant="outline" className="flex gap-2">
                      <Shield className="w-4 h-4" />
                      Activer l'authentification à deux facteurs
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Sessions actives</h3>
                    <div className="space-y-2 rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Ce navigateur</p>
                          <p className="text-sm text-muted-foreground">Chrome sur Windows • Paris, France</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <LogOut className="w-4 h-4 mr-2" />
                          Déconnecter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
