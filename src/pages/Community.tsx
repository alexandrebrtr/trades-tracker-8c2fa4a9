import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  ChevronRight, 
  MessageSquare, 
  Search, 
  Share2, 
  Star, 
  TrendingUp, 
  Trophy, 
  Users
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TraderProfile {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  winRate: number;
  trades: number;
  followers: number;
  isFollowing: boolean;
  badges: string[];
}

// Mock data for demo
const topTraders: TraderProfile[] = [
  {
    id: '1',
    name: 'Sophia Turner',
    username: 'sophia_trades',
    avatar: undefined,
    tier: 'platinum',
    winRate: 78,
    trades: 450,
    followers: 1200,
    isFollowing: true,
    badges: ['Top Performer', 'Consistent Trader']
  },
  {
    id: '2',
    name: 'Alex Chen',
    username: 'alexc_invest',
    avatar: undefined,
    tier: 'gold',
    winRate: 72,
    trades: 320,
    followers: 850,
    isFollowing: false,
    badges: ['Options Master']
  },
  {
    id: '3',
    name: 'Emma Wilson',
    username: 'emma_w',
    avatar: undefined,
    tier: 'silver',
    winRate: 65,
    trades: 210,
    followers: 420,
    isFollowing: false,
    badges: ['Rising Star']
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    username: 'mjohnson',
    avatar: undefined,
    tier: 'gold',
    winRate: 71,
    trades: 380,
    followers: 920,
    isFollowing: true,
    badges: ['Swing Expert', 'Crypto Guru']
  },
];

export default function Community() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="page-transition space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Communauté</h1>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des traders..."
                className="pl-9"
              />
            </div>
          </div>
          
          <Tabs defaultValue="discover" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="discover" className="flex gap-2 items-center">
                  <TrendingUp className="w-4 h-4" />
                  <span>Découvrir</span>
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex gap-2 items-center">
                  <Trophy className="w-4 h-4" />
                  <span>Classement</span>
                </TabsTrigger>
                <TabsTrigger value="following" className="flex gap-2 items-center">
                  <Users className="w-4 h-4" />
                  <span>Suivis</span>
                </TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>Inviter des amis</span>
              </Button>
            </div>
            
            <TabsContent value="discover" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-3 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Rejoignez la communauté de traders</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Partagez vos expériences, apprenez des autres traders et suivez les meilleurs performers pour améliorer vos compétences.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-violet-600 hover:bg-violet-700">
                      Compléter votre profil
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span>Top Traders</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topTraders.slice(0, 3).map((trader) => (
                        <div key={trader.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-muted">
                              <AvatarImage src={trader.avatar} alt={trader.name} />
                              <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{trader.name}</div>
                              <div className="text-sm text-muted-foreground">@{trader.username}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <div className="font-medium">{trader.winRate}% Win Rate</div>
                              <div className="text-sm text-muted-foreground">{trader.trades} trades</div>
                            </div>
                            <Button variant={trader.isFollowing ? "outline" : "default"} size="sm">
                              {trader.isFollowing ? "Suivi" : "Suivre"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      <span>Voir tous les traders</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <span>Discussions récentes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">Alex Chen</span>
                          <span className="text-xs text-muted-foreground">il y a 2h</span>
                        </div>
                        <p className="text-sm">Quelle est votre stratégie préférée pour les actions volatiles ?</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>16 réponses</span>
                          <span>•</span>
                          <span>8 likes</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>S</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">Sophie Martin</span>
                          <span className="text-xs text-muted-foreground">il y a 4h</span>
                        </div>
                        <p className="text-sm">Comment gérez-vous le stress lors des périodes de forte volatilité ?</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>23 réponses</span>
                          <span>•</span>
                          <span>12 likes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      <span>Voir toutes les discussions</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Classement des meilleurs traders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topTraders.map((trader, index) => (
                      <div key={trader.id} className="flex items-center border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="font-bold text-lg w-8">{index + 1}</div>
                          <Avatar className="h-12 w-12 border-2 border-muted">
                            <AvatarImage src={trader.avatar} alt={trader.name} />
                            <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {trader.name}
                              {index === 0 && (
                                <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-500">
                                  <Award className="w-3 h-3" /> Top Trader
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">@{trader.username}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {trader.badges.map((badge, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{badge}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="font-medium">{trader.winRate}% Win Rate</div>
                          <div className="text-sm text-muted-foreground">{trader.trades} trades</div>
                          <div className="text-xs text-muted-foreground">{trader.followers} followers</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="following" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traders que vous suivez</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topTraders
                      .filter(trader => trader.isFollowing)
                      .map((trader) => (
                        <div key={trader.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-muted">
                              <AvatarImage src={trader.avatar} alt={trader.name} />
                              <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{trader.name}</div>
                              <div className="text-sm text-muted-foreground">@{trader.username}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <div className="font-medium">{trader.winRate}% Win Rate</div>
                              <div className="text-sm text-muted-foreground">{trader.trades} trades</div>
                            </div>
                            <Button variant="outline" size="sm">
                              Ne plus suivre
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                  {topTraders.filter(trader => trader.isFollowing).length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium text-lg mb-1">Vous ne suivez aucun trader</h3>
                      <p className="text-muted-foreground mb-4">
                        Suivez des traders pour voir leurs performances et apprendre de leurs stratégies
                      </p>
                      <Button>Découvrir des traders</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
