import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePremium } from '@/context/PremiumContext';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Star, Wallet, Calendar, HandCoins, Share, Users, Crown } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SocialStats } from '@/components/profile/SocialStats';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { FollowSection } from '@/components/profile/FollowSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ActivityItem {
  id: string;
  type: 'trade' | 'comment' | 'like' | 'follow';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  trades?: number;
  winRate?: number;
  isFollowing?: boolean;
}

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
  const [currentView, setCurrentView] = useState<'feed' | 'followers' | 'following' | 'likes' | 'comments'>('feed');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const [mockActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'trade',
      title: 'Trade AAPL',
      description: 'Achat de 10 actions à 150€',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      metadata: { pnl: 150 }
    },
    {
      id: '2',
      type: 'comment',
      title: 'Commentaire sur TSLA',
      description: 'Belle analyse technique !',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
      id: '3',
      type: 'follow',
      title: 'Vous suivez TraderPro',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: '4',
      type: 'like',
      title: 'Vous avez aimé un trade',
      description: 'MSFT +5.2%',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    }
  ]);

  const [mockFollowers, setMockFollowers] = useState<User[]>([
    {
      id: '1',
      name: 'TraderPro',
      avatar: '',
      trades: 256,
      winRate: 68,
      isFollowing: true
    },
    {
      id: '2',
      name: 'InvestorElite',
      avatar: '',
      trades: 124,
      winRate: 72,
      isFollowing: false
    }
  ]);

  const [mockFollowing, setMockFollowing] = useState<User[]>([
    {
      id: '3',
      name: 'CryptoKing',
      avatar: '',
      trades: 89,
      winRate: 62,
      isFollowing: true
    },
    {
      id: '4',
      name: 'StockMaster',
      avatar: '',
      trades: 310,
      winRate: 75,
      isFollowing: true
    },
    {
      id: '5',
      name: 'OptionQueen',
      avatar: '',
      trades: 167,
      winRate: 59,
      isFollowing: true
    }
  ]);

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

  const toggleFollowUser = (userId: string) => {
    setMockFollowers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
    
    setMockFollowing(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );

    toast({
      title: "Succès",
      description: "Statut de suivi mis à jour",
    });
  };

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString('fr-FR');
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

  const handleShowFollowers = () => {
    setCurrentView('followers');
  };

  const handleShowFollowing = () => {
    setCurrentView('following');
  };

  const handleShowLikes = () => {
    setCurrentView('likes');
  };

  const handleShowComments = () => {
    setCurrentView('comments');
  };

  const handleRedirectToPremium = () => {
    navigate('/premium');
  };

  if (!user || (!profile && isOwnProfile) || (!viewingProfile && !isOwnProfile)) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

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
                      <AvatarImage src={isOwnProfile ? profile.avatar_url || "" : viewingProfile.avatar_url || ""} alt={name} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {name.charAt(0).toUpperCase() || (isOwnProfile ? user.email?.charAt(0).toUpperCase() : viewingProfile?.username?.charAt(0).toUpperCase()) || "T"}
                      </AvatarFallback>
                    </Avatar>
                    {!isEditing ? (
                      <h2 className="text-xl font-semibold">{name || (isOwnProfile ? user.email?.split('@')[0] : viewingProfile?.username) || 'Trader'}</h2>
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
                      <p className="mt-1">
                        {isOwnProfile 
                          ? new Date(profile.created_at).toLocaleDateString('fr-FR')
                          : viewingProfile?.created_at 
                            ? new Date(viewingProfile.created_at).toLocaleDateString('fr-FR') 
                            : 'Non disponible'
                        }
                      </p>
                    </div>

                    {isPremium && isOwnProfile && (
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-sm font-medium">Abonnement depuis</h3>
                          <p className="mt-1 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {profile?.premium_since ? 
                              new Date(profile.premium_since).toLocaleDateString('fr-FR') : 
                              "Non disponible"}
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
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            {isPremium ? (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-3">
                  <SocialStats 
                    followersCount={mockFollowers.length} 
                    followingCount={mockFollowing.length}
                    tradesCount={isOwnProfile ? (profile.trades_count || 0) : (viewingProfile?.trades_count || 0)}
                    winRate={68}
                    likesReceived={24}
                    commentsCount={12}
                    onShowFollowers={handleShowFollowers}
                    onShowFollowing={handleShowFollowing}
                    onShowLikes={handleShowLikes}
                    onShowComments={handleShowComments}
                  />
                </div>
  
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    {currentView === 'feed' && (
                      <>
                        {isOwnProfile && (
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={profile.avatar_url || ""} alt={name} />
                                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                                    {name.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "T"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Input 
                                    placeholder="Partagez vos idées de trading avec la communauté..." 
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <Share className="h-4 w-4" />
                                  Partager un trade
                                </Button>
                                <Button>Publier</Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
  
                        <RecentActivity activities={mockActivity} />
                      </>
                    )}
  
                    {currentView === 'followers' && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Followers</CardTitle>
                          <CardDescription>
                            Les utilisateurs qui suivent {isOwnProfile ? "votre profil" : `${viewingProfile?.username || 'ce profil'}`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {mockFollowers.length === 0 ? (
                            <p className="text-center text-muted-foreground py-6">
                              Aucun follower pour le moment
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {mockFollowers.map((follower) => (
                                <div 
                                  key={follower.id} 
                                  className="flex items-center space-x-3 py-2 border-b last:border-0 hover:bg-secondary/20 rounded-md px-2 cursor-pointer"
                                  onClick={() => navigate(`/profile/${follower.id}`)}
                                >
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={follower.avatar} alt={follower.name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                      {follower.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{follower.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {follower.trades ?? 0} trades · {follower.winRate ?? 0}% win rate
                                    </p>
                                  </div>
                                  
                                  {isOwnProfile && (
                                    <Button 
                                      variant={follower.isFollowing ? "outline" : "default"} 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFollowUser(follower.id);
                                      }}
                                    >
                                      {follower.isFollowing ? "Following" : "Follow"}
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
  
                    {currentView === 'following' && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Following</CardTitle>
                          <CardDescription>
                            Les utilisateurs que {isOwnProfile ? "vous suivez" : `${viewingProfile?.username || 'cet utilisateur'} suit`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {mockFollowing.length === 0 ? (
                            <p className="text-center text-muted-foreground py-6">
                              Aucun utilisateur suivi pour le moment
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {mockFollowing.map((followed) => (
                                <div 
                                  key={followed.id} 
                                  className="flex items-center space-x-3 py-2 border-b last:border-0 hover:bg-secondary/20 rounded-md px-2 cursor-pointer"
                                  onClick={() => navigate(`/profile/${followed.id}`)}
                                >
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={followed.avatar} alt={followed.name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                      {followed.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{followed.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {followed.trades ?? 0} trades · {followed.winRate ?? 0}% win rate
                                    </p>
                                  </div>
                                  
                                  {isOwnProfile && (
                                    <Button 
                                      variant={followed.isFollowing ? "outline" : "default"} 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFollowUser(followed.id);
                                      }}
                                    >
                                      {followed.isFollowing ? "Following" : "Follow"}
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
  
                    {currentView === 'likes' && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Likes</CardTitle>
                          <CardDescription>
                            Contenus aimés par {isOwnProfile ? "vous" : viewingProfile?.username || 'cet utilisateur'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-center text-muted-foreground py-12">
                            Fonctionnalité en cours de développement
                          </p>
                        </CardContent>
                      </Card>
                    )}
  
                    {currentView === 'comments' && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Commentaires</CardTitle>
                          <CardDescription>
                            Commentaires laissés par {isOwnProfile ? "vous" : viewingProfile?.username || 'cet utilisateur'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-center text-muted-foreground py-12">
                            Fonctionnalité en cours de développement
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
  
                <div className="md:col-span-1 space-y-6">
                  {currentView === 'feed' && (
                    <>
                      <FollowSection 
                        users={mockFollowers}
                        title="Followers"
                        emptyMessage={`${isOwnProfile ? "Vous n'avez" : viewingProfile?.username || "Cet utilisateur n'a"} pas encore de followers.`}
                        onToggleFollow={toggleFollowUser}
                      />
                      
                      <FollowSection 
                        users={mockFollowing}
                        title="Following"
                        emptyMessage={`${isOwnProfile ? "Vous ne suivez" : viewingProfile?.username || "Cet utilisateur ne suit"} personne pour le moment.`}
                        onToggleFollow={toggleFollowUser}
                      />
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-8 space-y-6">
                <div className="text-center space-y-3">
                  <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Fonctionnalité Premium</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    L'accès aux fonctionnalités sociales est réservé aux utilisateurs premium.
                    Passez à Premium pour connecter avec d'autres traders, partager vos analyses et développer votre réseau.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button 
                    size="lg"
                    onClick={handleRedirectToPremium}
                    className="px-8"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Passer à l'abonnement Premium
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="finances" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-2 md:col-span-1">
                <CardHeader>
                  <CardTitle>Performances des trades</CardTitle>
                  <CardDescription>
                    Récapitulatif {isOwnProfile ? "de vos" : "des"} performances de trading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card/70 p-4 rounded-lg border">
                        <h3 className="text-sm font-medium text-muted-foreground">Trades totaux</h3>
                        <p className="text-2xl font-bold mt-1">{profile.trades_count || 0}</p>
                      </div>
                      <div className="bg-card/70 p-4 rounded-lg border">
                        <h3 className="text-sm font-medium text-muted-foreground">Win Rate</h3>
                        <p className="text-2xl font-bold mt-1 text-green-500">68%</p>
                      </div>
                      <div className="bg-card/70 p-4 rounded-lg border">
                        <h3 className="text-sm font-medium text-muted-foreground">Profit moyen</h3>
                        <p className="text-2xl font-bold mt-1 text-green-500">+42€</p>
                      </div>
                      <div className="bg-card/70 p-4 rounded-lg border">
                        <h3 className="text-sm font-medium text-muted-foreground">Perte moyenne</h3>
                        <p className="text-2xl font-bold mt-1 text-red-500">-18€</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button asChild className="w-full">
                        <Link to="/statistics">Voir toutes les statistiques</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 md:col-span-1">
                <CardHeader>
                  <CardTitle>Portefeuille</CardTitle>
                  <CardDescription>
                    État actuel {isOwnProfile ? "de votre" : "du"} portefeuille
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-card/70 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-muted-foreground">Solde total</h3>
                      <p className="text-3xl font-bold mt-1">{parseFloat(balance).toLocaleString('fr-FR')} €</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Répartition des actifs</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Actions</span>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                        <div className="w-full bg-secondary/50 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Crypto</span>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                        <div className="w-full bg-secondary/50 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Liquidités</span>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <div className="w-full bg-secondary/50 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button asChild className="w-full">
                        <Link to="/portfolio">Gérer le portefeuille</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
