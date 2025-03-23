
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RefreshCw, Save, KeyRound } from 'lucide-react';
import { UserSettingsService } from '@/services/UserSettingsService';
import { useAuth } from '@/context/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

export function PasswordSection() {
  const { user } = useAuth();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fonction pour réinitialiser le mot de passe
  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Veuillez saisir votre adresse email');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await UserSettingsService.resetPassword(email);
      if (result.success) {
        setEmailSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // État pour la mise à jour directe du mot de passe
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Fonction pour mettre à jour le mot de passe
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    setUpdateLoading(true);
    try {
      // Vérifier le mot de passe actuel
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user!.email!,
        password: currentPassword,
      });
      
      if (signInError) {
        toast.error('Mot de passe actuel incorrect');
        return;
      }
      
      const result = await UserSettingsService.updatePassword(newPassword);
      if (result.success) {
        setIsUpdateDialogOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Mot de passe mis à jour avec succès');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du mot de passe');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité du compte</CardTitle>
        <CardDescription>
          Gérez les paramètres de sécurité de votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center">
            <KeyRound className="mr-2 h-5 w-5 text-muted-foreground" />
            Modifier le mot de passe
          </h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Option 1: Réinitialisation par email */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Réinitialisation par email</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Un lien de réinitialisation sera envoyé à votre adresse email.
              </p>
              
              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Recevoir un email
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {emailSent ? 'Email envoyé' : 'Réinitialiser votre mot de passe'}
                    </DialogTitle>
                    <DialogDescription>
                      {emailSent 
                        ? 'Vérifiez votre boîte de réception et suivez les instructions.' 
                        : 'Veuillez saisir votre adresse email pour recevoir un lien de réinitialisation.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {!emailSent ? (
                    <>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Adresse email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email || (user?.email || '')}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleResetPassword} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            'Envoyer le lien'
                          )}
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="bg-green-100 p-3 rounded-full mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-center mb-6">
                        Si votre adresse existe dans notre système, vous recevrez un email avec les instructions à suivre.
                      </p>
                      <Button onClick={() => {
                        setIsResetDialogOpen(false);
                        setEmailSent(false);
                      }}>
                        Fermer
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Option 2: Mise à jour directe */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Modification directe</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Modifier votre mot de passe directement si vous connaissez votre mot de passe actuel.
              </p>
              
              <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Modifier maintenant
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier votre mot de passe</DialogTitle>
                    <DialogDescription>
                      Veuillez saisir votre mot de passe actuel et votre nouveau mot de passe.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleUpdatePassword} disabled={updateLoading}>
                      {updateLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Mise à jour...
                        </>
                      ) : (
                        'Mettre à jour'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="mt-2 flex items-center">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            <p className="text-xs text-muted-foreground">
              Pour des raisons de sécurité, vous serez déconnecté après la modification de votre mot de passe.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
