
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Wallet } from 'lucide-react';

interface ProfileInfoProps {
  isEditing: boolean;
  isOwnProfile: boolean;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: string;
  avatarUrl: string;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setAddress: (address: string) => void;
  setBalance: (balance: string) => void;
}

export function ProfileInfo({
  isEditing,
  isOwnProfile,
  name,
  email,
  phone,
  address,
  balance,
  avatarUrl,
  setName,
  setPhone,
  setAddress,
  setBalance
}: ProfileInfoProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>
          {isOwnProfile ? "Gérez vos informations de profil" : "Informations de profil"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {name.charAt(0).toUpperCase() || email.charAt(0).toUpperCase() || "T"}
            </AvatarFallback>
          </Avatar>
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

          {isOwnProfile && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </div>
              <p>{email}</p>
            </div>
          )}

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
                step="0.01"
              />
            ) : (
              <p className="text-lg font-semibold">{parseFloat(balance).toLocaleString('fr-FR')} €</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
