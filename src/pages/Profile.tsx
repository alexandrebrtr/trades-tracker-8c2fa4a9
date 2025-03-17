
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { User, Star, Users, HandCoins, Crown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePremium } from '@/context/PremiumContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Imported components
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { AccountInfo } from '@/components/profile/AccountInfo';
import { FinancesTab } from '@/components/profile/FinancesTab';
import { SocialTab } from '@/components/profile/SocialTab';

export default function Profile() {
  const { isPremium, premiumExpires } = usePremium();
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    if (userId && userId !== user?.id) {
      setIsOwnProfile(false);
      loadUserProfile(userId);
    } else {
      setIsOwnProfile(true);
      if (user && profile) {
        setViewingProfile(profile);
        setName(profile.username || '');
        setEmail(user.email || '');
        setPhone(profile.phone || '');
        setAddress(profile.address || '');
        setBalance(profile.balance?.toString() || '0');
      }
    }
  }, [user, profile, userId, navigate]);

  const loadUserProfile = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setViewingProfile(data);
      setName(data.username || '');
      setEmail('');
      setPhone(data.phone || '');
      setAddress(data.address || '');
      setBalance(data.balance?.toString() || '0');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil de l'utilisateur",
        variant: "destructive"
      });
      navigate('/profile');
    }
  };

  const handleSave = async () => {
    if (!user || !isOwnProfile) return;
    
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

  const handleRedirectToPremium = () => {
    navigate('/premium');
  };

  if (!user || (!profile && isOwnProfile) || (!viewingProfile && !isOwnProfile)) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  const avatarUrl = isOwnProfile ? profile.avatar_url || "" : viewingProfile.avatar_url || "";
  const createdAt = isOwnProfile 
    ? profile.created_at 
    : viewingProfile?.created_at || new Date().toISOString();

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {isOwnProfile ? 'Mon Profil' : `Profil de ${viewingProfile?.username || 'Utilisateur'}`}
          </h1>
          <div className="flex gap-2">
            {isPremium && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                <Star className="h-3.5 w-3.5 mr-1 fill-yellow-500" />
                Premium
              </Badge>
            )}
            {isOwnProfile && (
              <Button 
                variant={isEditing ? "outline" : "default"} 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={loading}
              >
                {isEditing ? "Enregistrer" : "Modifier"}
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile" className="flex gap-1 items-center">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="flex gap-1 items-center"
              disabled={!isPremium}
            >
              <Users className="h-4 w-4" />
              Social
              {!isPremium && <Crown className="h-3 w-3 ml-1 text-yellow-500" />}
            </TabsTrigger>
            <TabsTrigger value="finances" className="flex gap-1 items-center">
              <HandCoins className="h-4 w-4" />
              Finances
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ProfileInfo 
                isEditing={isEditing}
                isOwnProfile={isOwnProfile}
                name={name}
                email={email}
                phone={phone}
                address={address}
                balance={balance}
                avatarUrl={avatarUrl}
                setName={setName}
                setPhone={setPhone}
                setAddress={setAddress}
                setBalance={setBalance}
              />

              <AccountInfo 
                isOwnProfile={isOwnProfile}
                isPremium={isPremium}
                createdAt={createdAt}
                premiumSince={profile?.premium_since || null}
                premiumExpires={premiumExpires}
              />
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <SocialTab 
              isPremium={isPremium}
              isOwnProfile={isOwnProfile}
              profile={profile}
              viewingProfile={viewingProfile}
              avatarUrl={avatarUrl}
              name={name}
              email={email}
              handleRedirectToPremium={handleRedirectToPremium}
            />
          </TabsContent>

          <TabsContent value="finances" className="mt-6">
            <FinancesTab 
              balance={balance}
              tradesCount={isOwnProfile ? (profile.trades_count || 0) : (viewingProfile?.trades_count || 0)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
