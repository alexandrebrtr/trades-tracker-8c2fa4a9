
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePremium } from '@/context/PremiumContext';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Star, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { isPremium } = usePremium();
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialiser les champs avec les données du profil
    if (profile) {
      setName(profile.username || '');
      setEmail(user.email || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setBalance(profile.balance?.toString() || '0');
    }
  }, [user, profile, navigate]);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: name,
          phone,
          address,
          balance: parseFloat(balance) || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Rafraîchir le profil
      await refreshProfile();
      
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return null; // Ou un composant de chargement
  }

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          <div className="flex gap-2">
            {isPremium && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                <Star className="h-3.5 w-3.5 mr-1 fill-yellow-500" />
                Premium
              </Badge>
            )}
            <Button 
              variant={isEditing ? "outline" : "default"} 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
            >
              {isEditing ? "Enregistrer" : "Modifier"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Gérez vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || ""} alt={name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {name.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
                {!isEditing ? (
                  <h2 className="text-xl font-semibold">{name || user.email?.split('@')[0] || 'Trader'}</h2>
                ) : (
                  <Button variant="outline" size="sm">
                    Changer l'avatar
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    Nom d'utilisateur
                  </div>
                  {isEditing ? (
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Votre nom" 
                    />
                  ) : (
                    <p>{name || 'Non renseigné'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </div>
                  <p>{email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    Téléphone
                  </div>
                  {isEditing ? (
                    <Input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="Numéro de téléphone" 
                    />
                  ) : (
                    <p>{phone || "Non renseigné"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    Adresse
                  </div>
                  {isEditing ? (
                    <Input 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="Votre adresse" 
                    />
                  ) : (
                    <p>{address || "Non renseignée"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Wallet className="mr-2 h-4 w-4" />
                    Solde du portefeuille (€)
                  </div>
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={balance} 
                      onChange={(e) => setBalance(e.target.value)} 
                      placeholder="Solde en euros" 
                    />
                  ) : (
                    <p>{parseFloat(balance).toLocaleString('fr-FR')} €</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Compte</CardTitle>
              <CardDescription>
                Informations sur votre compte et abonnement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Type de compte</h3>
                  <p className="flex items-center mt-1">
                    {isPremium ? (
                      <>
                        <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
                        <span>Premium</span>
                      </>
                    ) : (
                      "Gratuit"
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Date d'inscription</h3>
                  <p className="mt-1">{new Date(profile.created_at).toLocaleDateString('fr-FR')}</p>
                </div>

                {isPremium && (
                  <div>
                    <h3 className="text-sm font-medium">Prochaine facturation</h3>
                    <p className="mt-1">Non disponible</p>
                  </div>
                )}

                <div className="pt-4">
                  {!isPremium ? (
                    <Button asChild className="w-full">
                      <Link to="/premium">Passer à Premium</Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/settings">Gérer l'abonnement</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
