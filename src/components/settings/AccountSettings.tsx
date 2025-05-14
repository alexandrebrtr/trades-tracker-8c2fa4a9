
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function AccountSettings() {
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [updating, setUpdating] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    if (!email || email === user.email) {
      toast({
        title: "Aucun changement",
        description: "Veuillez entrer une nouvelle adresse email.",
      });
      return;
    }
    
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      toast({
        title: "Email mis à jour",
        description: "Veuillez vérifier votre boîte de réception pour confirmer votre nouvelle adresse email.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour de l'email.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    if (!password) {
      toast({
        title: "Mot de passe actuel requis",
        description: "Veuillez entrer votre mot de passe actuel.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Nouveau mot de passe invalide",
        description: "Le nouveau mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Les mots de passe ne correspondent pas",
        description: "Le nouveau mot de passe et sa confirmation doivent être identiques.",
        variant: "destructive",
      });
      return;
    }
    
    setResetting(true);
    try {
      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password,
      });
      
      if (signInError) throw new Error("Mot de passe actuel incorrect");
      
      // Then update password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
      });
      
      // Clear form
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour du mot de passe.",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    if (deleteConfirmation !== user.email) {
      toast({
        title: "Confirmation incorrecte",
        description: "Veuillez saisir votre adresse email pour confirmer la suppression.",
        variant: "destructive",
      });
      return;
    }
    
    setDeleting(true);
    try {
      // Delete user data from profiles table first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Delete user account from auth
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      // Sign out the user
      await supabase.auth.signOut();
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
      });
      
      // Redirect to home page
      window.location.href = '/';
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la suppression du compte.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };
  
  if (!user) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Vous n'êtes pas connecté</AlertTitle>
        <AlertDescription>
          Veuillez vous connecter pour accéder aux paramètres de votre compte.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'adresse email</CardTitle>
          <CardDescription>
            Changez l'adresse email associée à votre compte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateEmail}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updating || !email || email === user.email}>
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mettre à jour l'email
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Modifier le mot de passe</CardTitle>
          <CardDescription>
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={resetting || !password || !newPassword || !confirmPassword}>
              {resetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mettre à jour le mot de passe
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Supprimer le compte</CardTitle>
          <CardDescription>
            Attention : cette action est irréversible et supprimera toutes vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Supprimer mon compte</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                  Pour confirmer, veuillez saisir votre adresse email : {user.email}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="confirm-email">Confirmez votre email</Label>
                  <Input
                    id="confirm-email"
                    placeholder={user.email || 'votre@email.com'}
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteConfirmation('')}>Annuler</Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmation !== user.email}
                >
                  {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Supprimer définitivement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
