
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserSettingsService } from '@/services/UserSettingsService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Vérifier si l'utilisateur a un token de réinitialisation dans l'URL
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (!data.session || error) {
        // Si pas de session, on vérifie s'il y a un hash dans l'URL (lien de réinitialisation)
        if (!window.location.hash) {
          // Si pas de hash, rediriger vers la page de connexion
          navigate('/login');
          toast.error('Le lien de réinitialisation est invalide ou expiré');
        }
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleResetPassword = async () => {
    setError('');
    
    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await UserSettingsService.updatePassword(newPassword);
      
      if (result.success) {
        setIsSuccess(true);
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        throw result.error;
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Réinitialisation du mot de passe</CardTitle>
          <CardDescription>
            Créez un nouveau mot de passe pour votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isSuccess ? (
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full p-3 bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="font-medium text-lg">Mot de passe réinitialisé avec succès</h3>
              <p className="text-muted-foreground">
                Vous allez être redirigé vers la page de connexion...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-destructive/10 p-3 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                Votre mot de passe doit contenir au moins 8 caractères.
              </div>
            </>
          )}
        </CardContent>
        
        {!isSuccess && (
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleResetPassword} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Réinitialisation...
                </>
              ) : (
                'Réinitialiser le mot de passe'
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
