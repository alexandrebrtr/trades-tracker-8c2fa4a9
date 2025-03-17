
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Share, Crown } from 'lucide-react';
import { SocialStats } from '@/components/profile/SocialStats';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { FollowSection } from '@/components/profile/FollowSection';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  trades?: number;
  winRate?: number;
  isFollowing?: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'trade' | 'comment' | 'like' | 'follow';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface SocialTabProps {
  isPremium: boolean;
  isOwnProfile: boolean;
  profile: any;
  viewingProfile: any;
  avatarUrl: string;
  name: string;
  email: string;
  handleRedirectToPremium: () => void;
}

export function SocialTab({
  isPremium,
  isOwnProfile,
  profile,
  viewingProfile,
  avatarUrl,
  name,
  email,
  handleRedirectToPremium
}: SocialTabProps) {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'feed' | 'followers' | 'following' | 'likes' | 'comments'>('feed');
  
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
  };

  const handleShowFollowers = () => setCurrentView('followers');
  const handleShowFollowing = () => setCurrentView('following');
  const handleShowLikes = () => setCurrentView('likes');
  const handleShowComments = () => setCurrentView('comments');

  if (!isPremium) {
    return (
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
    );
  }

  return (
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
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                          {name.charAt(0).toUpperCase() || email.charAt(0).toUpperCase() || "T"}
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
  );
}
