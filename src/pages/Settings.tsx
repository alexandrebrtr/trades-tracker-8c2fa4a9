
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { RefreshCw, Save } from 'lucide-react';
import { UserSettingsService } from '@/services/UserSettingsService';

export default function Settings() {
  const { user, profile, updateProfile } = useAuth();
  const { userSettings, updateUserSettings } = usePremium();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [currentTab, setCurrentTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setBio(profile.bio || '');
    }
    
    if (user) {
      setEmail(user.email || '');
    }
  }, [user, profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        username,
        bio
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveSettings = async () => {
    if (!user || !userSettings) return;
    
    setIsSaving(true);
    try {
      await UserSettingsService.updateUserSettings(user.id, userSettings);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Compte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>
                  Modifiez vos informations personnelles qui seront visibles par les autres utilisateurs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Votre nom d'utilisateur"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    L'email ne peut pas être modifié ici. Contactez l'administrateur pour le changer.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Quelques mots à propos de vous"
                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            {userSettings && (
              <AppearanceSettings 
                userSettings={userSettings} 
                onSettingsChange={updateUserSettings}
                onSaveSettings={handleSaveSettings}
                isSaving={isSaving}
              />
            )}
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Gérez comment et quand vous souhaitez être notifié.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center py-8">
                  Les préférences de notifications seront disponibles dans une prochaine mise à jour.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Gérez les paramètres de sécurité de votre compte et vos données personnelles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Modifier le mot de passe</h3>
                  <p className="text-muted-foreground text-sm">
                    Pour des raisons de sécurité, cette fonctionnalité nécessite une vérification par email.
                    Utilisez l'option "Mot de passe oublié" sur la page de connexion pour changer votre mot de passe.
                  </p>
                </div>
                
                <div className="space-y-2 pt-4">
                  <h3 className="text-lg font-medium">Télécharger mes données</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Téléchargez une copie de vos données personnelles et de votre historique de trading.
                  </p>
                  <Button variant="outline">
                    Demander mes données
                  </Button>
                </div>
                
                <div className="space-y-2 pt-4">
                  <h3 className="text-lg font-medium text-destructive">Supprimer mon compte</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    La suppression de votre compte est irréversible et entraînera la perte de toutes vos données.
                  </p>
                  <Button variant="destructive">
                    Supprimer mon compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
