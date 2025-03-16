
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeCheck, Search, TrendingUp, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Interface pour représenter un membre
interface Member {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  trades: number;
  followers: number;
  winRate: number;
  roi: number;
  isVerified: boolean;
  trending: boolean;
}

export function CommunityMembers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('followers');
  const [following, setFollowing] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchMembers();
    
    // Set up real-time subscription for profiles changes
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => {
          fetchMembers();
        }
      )
      .subscribe();
      
    // Set up real-time subscription for trades changes  
    const tradesChannel = supabase
      .channel('trades-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trades' }, 
        () => {
          fetchMembers();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(tradesChannel);
    };
  }, []);
  
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      // Récupérer tous les profils des utilisateurs
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error("Erreur lors de la récupération des membres:", error);
        throw error;
      }
      
      // Récupérer les statistiques de trades pour chaque utilisateur
      const membersWithStats = await Promise.all(data.map(async (profile) => {
        // Récupérer les trades de l'utilisateur
        const { data: userTrades, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', profile.id);
        
        if (tradesError) {
          console.error("Erreur lors de la récupération des trades:", tradesError);
        }
        
        const trades = userTrades || [];
        
        // Calculer le win rate
        const winningTrades = trades.filter(trade => (trade.pnl || 0) > 0);
        const winRate = trades.length > 0 ? Math.round((winningTrades.length / trades.length) * 100) : 0;
        
        // Calculer le ROI
        const totalInvested = trades.reduce((sum, trade) => sum + (trade.size || 0), 0);
        const totalProfit = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        const roi = totalInvested > 0 ? Math.round((totalProfit / totalInvested) * 100 * 10) / 10 : 0;
        
        // Calculer les followers (simulé pour l'exemple)
        // Dans une vraie app, vous auriez une table followers
        const followers = Math.floor(Math.random() * 500);
        
        // Créer un objet membre enrichi
        return {
          id: profile.id,
          name: profile.username || "Utilisateur anonyme",
          username: `@${profile.username?.toLowerCase().replace(/\s+/g, '_') || 'trader'}`,
          avatar: profile.avatar_url || '',
          bio: profile.bio || "Trader sur TradeTracker",
          trades: trades.length,
          followers,
          winRate,
          roi,
          isVerified: profile.premium === true,
          trending: Math.random() > 0.7 // 30% de chance d'être tendance pour l'exemple
        };
      }));
      
      setMembers(membersWithStats);
    } catch (error) {
      console.error("Erreur lors du chargement des membres:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les membres.",
        variant: "destructive"
      });
      // Utiliser des données de secours en cas d'erreur
      setMembers(getDefaultMembers());
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFollow = async (memberId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour suivre un membre.",
        variant: "destructive"
      });
      return;
    }
    
    // Convertir l'ID en nombre pour la compatibilité avec le state
    if (following.includes(memberId)) {
      setFollowing(following.filter(id => id !== memberId));
      toast({
        title: "Désabonnement",
        description: "Vous ne suivez plus ce membre."
      });
    } else {
      setFollowing([...following, memberId]);
      toast({
        title: "Abonnement",
        description: "Vous suivez maintenant ce membre."
      });
    }
    
    // Dans une vraie app, vous sauvegarderiez ces relations dans la base de données
    // Par exemple:
    // await supabase.from('followers').upsert({ follower_id: user.id, following_id: memberId });
  };
  
  const getDefaultMembers = (): Member[] => [
    {
      id: "1",
      name: 'Emma Bernard',
      username: '@emma_trader',
      avatar: '',
      bio: 'Day trader spécialisée en actions et indices. 5 ans d\'expérience.',
      trades: 876,
      followers: 245,
      winRate: 68,
      roi: 14.5,
      isVerified: true,
      trending: true
    },
    {
      id: "2",
      name: 'Thomas Martin',
      username: '@tomtrader',
      avatar: '',
      bio: 'Investisseur crypto & swing trader. Analyste technique certifié.',
      trades: 532,
      followers: 189,
      winRate: 72,
      roi: 21.2,
      isVerified: false,
      trending: false
    },
    {
      id: "3",
      name: 'Sophie Dubois',
      username: '@sophmarket',
      avatar: '',
      bio: 'Position trader actions. Je partage mes analyses et résultats chaque semaine.',
      trades: 327,
      followers: 97,
      winRate: 65,
      roi: 9.7,
      isVerified: false,
      trending: false
    },
    {
      id: "4",
      name: 'Nicolas Klein',
      username: '@niko_invest',
      avatar: '',
      bio: 'Trader options et futures. Formateur en gestion des risques.',
      trades: 1204,
      followers: 567,
      winRate: 74,
      roi: 18.3,
      isVerified: true,
      trending: false
    },
    {
      id: "5",
      name: 'Laura Blanc',
      username: '@lblanc_trade',
      avatar: '',
      bio: 'Day & swing trader. J\'analyse principalement les marchés européens.',
      trades: 689,
      followers: 215,
      winRate: 69,
      roi: 12.8,
      isVerified: false,
      trending: true
    },
    {
      id: "6",
      name: 'Jean Moreau',
      username: '@jean_scalp',
      avatar: '',
      bio: 'Scalper forex et indices. Stratégies intraday uniquement.',
      trades: 2341,
      followers: 412,
      winRate: 62,
      roi: 8.4,
      isVerified: false,
      trending: false
    }
  ];
  
  const filteredMembers = members
    .filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.bio.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'followers') {
        return b.followers - a.followers;
      } else if (sortBy === 'winRate') {
        return b.winRate - a.winRate;
      } else if (sortBy === 'roi') {
        return b.roi - a.roi;
      } else {
        return b.trades - a.trades;
      }
    });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement des membres...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Rechercher un membre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap">Trier par:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">Abonnés</SelectItem>
              <SelectItem value="winRate">Win Rate</SelectItem>
              <SelectItem value="roi">ROI</SelectItem>
              <SelectItem value="trades">Nombre de trades</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredMembers.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground">Aucun membre trouvé avec ces critères de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base flex items-center gap-1">
                        {member.name}
                        {member.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{member.username}</p>
                    </div>
                  </div>
                  {member.trending && (
                    <div className="bg-primary/10 text-primary rounded-full flex items-center px-2 py-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">Tendance</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 line-clamp-2">{member.bio}</p>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Trades</p>
                    <p className="font-bold">{member.trades}</p>
                  </div>
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="font-bold">{member.winRate}%</p>
                  </div>
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className="font-bold text-green-500">+{member.roi}%</p>
                  </div>
                  <div className="text-center p-2 bg-secondary/50 rounded-lg col-span-3">
                    <p className="text-xs text-muted-foreground">Abonnés</p>
                    <p className="font-bold">{member.followers}</p>
                  </div>
                </div>
                
                <Button 
                  variant={following.includes(member.id) ? "outline" : "default"} 
                  className="w-full"
                  onClick={() => handleFollow(member.id)}
                  disabled={member.id === user?.id}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {member.id === user?.id ? "Vous-même" : following.includes(member.id) ? "Abonné" : "Suivre"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
