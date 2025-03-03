import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePremium } from '@/context/PremiumContext';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { isPremium } = usePremium();
  const [name, setName] = useState('Trader');
  const [email, setEmail] = useState('trader@example.com');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    });
  };

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
                  <AvatarImage src="" alt={name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!isEditing ? (
                  <h2 className="text-xl font-semibold">{name}</h2>
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
                    Nom complet
                  </div>
                  {isEditing ? (
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Votre nom" 
                    />
                  ) : (
                    <p>{name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </div>
                  {isEditing ? (
                    <Input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="votre@email.com" 
                    />
                  ) : (
                    <p>{email}</p>
                  )}
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
                  <p className="mt-1">1 janvier 2023</p>
                </div>

                {isPremium && (
                  <div>
                    <h3 className="text-sm font-medium">Prochaine facturation</h3>
                    <p className="mt-1">1 mai 2023</p>
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
