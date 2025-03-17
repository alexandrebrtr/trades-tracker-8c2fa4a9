
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Calendar } from 'lucide-react';

interface AccountInfoProps {
  isOwnProfile: boolean;
  isPremium: boolean;
  createdAt: string;
  premiumSince: string | null;
  premiumExpires: string | null;
}

export function AccountInfo({
  isOwnProfile,
  isPremium,
  createdAt,
  premiumSince,
  premiumExpires
}: AccountInfoProps) {
  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Compte</CardTitle>
        <CardDescription>
          Informations sur {isOwnProfile ? "votre" : "le"} compte et abonnement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Type de compte</h3>
            <p className="flex items-center mt-1">
              {isPremium && isOwnProfile ? (
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
            <p className="mt-1">{new Date(createdAt).toLocaleDateString('fr-FR')}</p>
          </div>

          {isPremium && isOwnProfile && (
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium">Abonnement depuis</h3>
                <p className="mt-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {premiumSince ? new Date(premiumSince).toLocaleDateString('fr-FR') : "Non disponible"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Prochaine facturation</h3>
                <p className="mt-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatExpiryDate(premiumExpires)}
                </p>
              </div>
            </div>
          )}

          {isOwnProfile && (
            <div className="pt-4">
              {!isPremium ? (
                <Button asChild className="w-full">
                  <Link to="/premium">Passer à Premium</Link>
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/settings">Gérer l'abonnement</Link>
                  </Button>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    Votre abonnement sera renouvelé automatiquement le {formatExpiryDate(premiumExpires)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
