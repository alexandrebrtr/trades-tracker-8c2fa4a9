
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { RefreshCw, Save, Download, Users, Shield } from 'lucide-react';
import { UserSettingsService } from '@/services/UserSettingsService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { usePremium } from '@/context/PremiumContext';

export function AccountSection() {
  const { user, profile, updateProfile } = useAuth();
  const { isPremium, premiumExpires } = usePremium();
  const [username, setUsername] = useState(profile?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
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
  
  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const blob = await UserSettingsService.exportUserData(user.id);
      
      if (blob) {
        // Créer un lien pour télécharger le fichier
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donnees_${username || 'utilisateur'}_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Vos données ont été exportées avec succès');
      } else {
        throw new Error('Erreur lors de l\'exportation');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'exportation des données');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du profil</CardTitle>
        <CardDescription>
          Modifiez vos informations personnelles qui seront visibles par les autres utilisateurs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Information utilisateur */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-muted-foreground" />
              Identité
            </h3>
            
            {isPremium && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Premium jusqu'au {new Date(premiumExpires || '').toLocaleDateString()}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>
        
        {/* Exportation des données */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center">
              <Download className="mr-2 h-5 w-5 text-muted-foreground" />
              Mes données
            </h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Téléchargez une copie de toutes vos données personnelles, y compris votre profil, 
            vos trades et vos paramètres au format Excel.
          </p>
          
          <Button 
            variant="outline" 
            onClick={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Exportation...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Télécharger mes données
              </>
            )}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
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
  );
}
