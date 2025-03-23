
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function SecuritySection() {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Étape 1: Supprimer les données des tables personnalisées
      const { error: tradesError } = await supabase
        .from('trades')
        .delete()
        .eq('user_id', user.id);
      
      if (tradesError) throw tradesError;
      
      // Étape 2: Supprimer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Étape 3: Supprimer l'utilisateur auth
      const { error: userError } = await supabase.auth.admin.deleteUser(
        user.id
      );
      
      if (userError) throw userError;
      
      // Déconnexion
      await signOut();
      
      toast.success('Votre compte a été supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast.error('Erreur lors de la suppression du compte. Veuillez contacter l\'administrateur.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
          Suppression du compte
        </CardTitle>
        <CardDescription>
          La suppression de votre compte est irréversible et entraînera la perte de toutes vos données.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-destructive mr-3 mt-0.5" />
              <div>
                <h4 className="text-destructive font-medium">Attention</h4>
                <p className="text-sm text-destructive/80 mt-1">
                  La suppression de votre compte est définitive et ne peut pas être annulée. 
                  Toutes vos données personnelles, vos trades et vos paramètres seront supprimés.
                </p>
              </div>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Elle supprimera définitivement votre compte 
                  et toutes les données associées de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive hover:bg-destructive/90" 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
