
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

// Interface to represent a member
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
    console.log('Setting up members component and fetching users');
    fetchMembers();
    
    // Set up real-time subscription for profiles changes
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => {
          console.log('Profiles change detected, refreshing members');
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
          console.log('Trades change detected, refreshing members');
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
      console.log('Fetching all user profiles');
      
      // Get all user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error("Error fetching members:", profilesError);
        throw profilesError;
      }
      
      if (!profilesData || profilesData.length === 0) {
        console.log("No profiles found");
        setMembers([]);
        setIsLoading(false);
        return;
      }
      
      console.log(`Retrieved ${profilesData.length} profiles`);
      
      // Get trading statistics for each user
      const membersWithStats = await Promise.all(profilesData.map(async (profile) => {
        // Get user's trades
        const { data: userTrades, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', profile.id);
        
        if (tradesError) {
          console.error(`Error fetching trades for user ${profile.id}:`, tradesError);
        }
        
        const trades = userTrades || [];
        console.log(`Found ${trades.length} trades for user ${profile.id}`);
        
        // Calculate win rate
        const winningTrades = trades.filter(trade => (trade.pnl || 0) > 0);
        const winRate = trades.length > 0 ? Math.round((winningTrades.length / trades.length) * 100) : 0;
        
        // Calculate ROI
        const totalInvested = trades.reduce((sum, trade) => sum + (trade.size || 0), 0);
        const totalProfit = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        const roi = totalInvested > 0 ? Math.round((totalProfit / totalInvested) * 100 * 10) / 10 : 0;
        
        // Calculate followers (simulated for now)
        const followers = Math.floor(Math.random() * 500);
        
        // Default username if not defined
        const username = profile.username || "Trader anonyme";
        
        // Create an enriched member object
        return {
          id: profile.id,
          name: username,
          username: `@${username.toLowerCase().replace(/\s+/g, '_')}`,
          avatar: profile.avatar_url || '',
          bio: profile.bio || "Trader sur TradeTracker",
          trades: trades.length,
          followers,
          winRate,
          roi,
          isVerified: profile.premium === true,
          trending: Math.random() > 0.7 // 30% chance of being trending for demonstration
        };
      }));
      
      console.log(`Generated ${membersWithStats.length} members with statistics`);
      setMembers(membersWithStats);
    } catch (error) {
      console.error("Error loading members:", error);
      toast({
        title: "Error loading members",
        description: "Unable to load members.",
        variant: "destructive"
      });
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
        <p className="mt-4 text-muted-foreground">Loading members...</p>
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
