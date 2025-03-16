
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Trophy, TrendingUp, TrendingDown, Info, UserPlus, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface TopTrader {
  id: string;
  rank: number;
  name: string;
  username: string;
  avatar: string;
  winRate: number;
  roi: number;
  trades: number;
  profitFactor: number;
  isVerified: boolean;
  change: 'up' | 'down' | 'same';
  overallScore?: number;
}

export function CommunityTopTraders() {
  const [tabValue, setTabValue] = useState('monthly');
  const [following, setFollowing] = useState<string[]>([]);
  const [topTraders, setTopTraders] = useState<TopTrader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([
    { name: 'Win Rate', trader1: 87, trader2: 82, trader3: 79 },
    { name: 'ROI', trader1: 24.8, trader2: 21.3, trader3: 19.5 },
    { name: 'Profit Factor', trader1: 3.2, trader2: 2.9, trader3: 2.7 }
  ]);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchTopTraders();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trades' }, 
        () => {
          fetchTopTraders();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tabValue]);
  
  const fetchTopTraders = async () => {
    setIsLoading(true);
    try {
      // Get all users with their profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        setTopTraders([]);
        setIsLoading(false);
        return;
      }
      
      // For each profile, get their trades
      const tradersWithStats = await Promise.all(profiles.map(async (profile) => {
        // Get trades for this user
        const { data: trades, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });
          
        if (tradesError) {
          console.error("Error fetching trades for user", profile.id, tradesError);
          return null;
        }
        
        // Filter trades based on the selected time period
        const filteredTrades = trades?.filter(trade => {
          if (!trade.created_at) return false;
          
          const tradeDate = new Date(trade.created_at);
          const now = new Date();
          
          if (tabValue === 'weekly') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return tradeDate >= oneWeekAgo;
          } else if (tabValue === 'monthly') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return tradeDate >= oneMonthAgo;
          }
          return true; // alltime
        });
          
        if (!filteredTrades || filteredTrades.length === 0) {
          return null;
        }
        
        // Calculate trading stats
        const totalTrades = filteredTrades.length;
        const winningTrades = filteredTrades.filter(trade => (trade.pnl || 0) > 0);
        const winRate = Math.round((winningTrades.length / totalTrades) * 100);
        
        // Calculate ROI
        const totalInvested = filteredTrades.reduce((sum, trade) => sum + (trade.size || 0), 0);
        const totalProfit = filteredTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        const roi = totalInvested > 0 ? Math.round((totalProfit / totalInvested) * 100 * 10) / 10 : 0;
        
        // Calculate profit factor
        const grossProfit = filteredTrades
          .filter(trade => (trade.pnl || 0) > 0)
          .reduce((sum, trade) => sum + (trade.pnl || 0), 0);
          
        const grossLoss = Math.abs(filteredTrades
          .filter(trade => (trade.pnl || 0) < 0)
          .reduce((sum, trade) => sum + (trade.pnl || 0), 0));
          
        const profitFactor = grossLoss > 0 ? Math.round((grossProfit / grossLoss) * 10) / 10 : totalTrades > 0 ? 1 : 0;
        
        // Generate change status randomly for demo purposes
        // In a real app, you'd compare with previous periods
        const changeOptions: ('up' | 'down' | 'same')[] = ['up', 'down', 'same'];
        const change = changeOptions[Math.floor(Math.random() * changeOptions.length)];
        
        return {
          id: profile.id,
          name: profile.username || 'Trader anonyme',
          username: `@${profile.username?.toLowerCase().replace(/\s+/g, '_') || 'trader'}`,
          avatar: profile.avatar_url || '',
          winRate,
          roi,
          trades: totalTrades,
          profitFactor,
          isVerified: profile.premium === true,
          change,
          // Additional data for ranking
          overallScore: winRate * 0.4 + roi * 0.4 + profitFactor * 0.2
        };
      }));
      
      // Remove null entries and sort by overall score (prioritizing win rate)
      const validTraders = tradersWithStats
        .filter(Boolean)
        .sort((a, b) => ((b?.overallScore || 0) - (a?.overallScore || 0)));
      
      // Add rank
      const rankedTraders = validTraders.map((trader, index) => ({
        ...trader!,
        rank: index + 1
      }));
      
      setTopTraders(rankedTraders);
      
      // Generate performance data for the chart
      if (rankedTraders.length > 0) {
        const chartData = [
          { name: 'Win Rate', trader1: rankedTraders[0]?.winRate || 0, trader2: rankedTraders[1]?.winRate || 0, trader3: rankedTraders[2]?.winRate || 0 },
          { name: 'ROI', trader1: rankedTraders[0]?.roi || 0, trader2: rankedTraders[1]?.roi || 0, trader3: rankedTraders[2]?.roi || 0 },
          { name: 'Profit Factor', trader1: rankedTraders[0]?.profitFactor || 0, trader2: rankedTraders[1]?.profitFactor || 0, trader3: rankedTraders[2]?.profitFactor || 0 }
        ];
        setPerformanceData(chartData);
      }
    } catch (error) {
      console.error("Error fetching top traders:", error);
      // Use mock data in case of error
      setTopTraders(getDefaultTopTraders());
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFollow = (traderId: string) => {
    if (following.includes(traderId)) {
      setFollowing(following.filter(id => id !== traderId));
    } else {
      setFollowing([...following, traderId]);
    }
  };
  
  const getDefaultTopTraders = (): TopTrader[] => [
    {
      id: "1",
      rank: 1,
      name: 'Thomas Klein',
      username: '@thomas_trader',
      avatar: '',
      winRate: 87,
      roi: 24.8,
      trades: 146,
      profitFactor: 3.2,
      isVerified: true,
      change: 'up'
    },
    {
      id: "2",
      rank: 2,
      name: 'Emma Laurent',
      username: '@emma_invest',
      avatar: '',
      winRate: 82,
      roi: 21.3,
      trades: 203,
      profitFactor: 2.9,
      isVerified: true,
      change: 'up'
    },
    {
      id: "3",
      rank: 3,
      name: 'Hugo Mercier',
      username: '@hugo_m',
      avatar: '',
      winRate: 79,
      roi: 19.5,
      trades: 178,
      profitFactor: 2.7,
      isVerified: false,
      change: 'down'
    },
    {
      id: "4",
      rank: 4,
      name: 'Sophie Dubois',
      username: '@sophmarket',
      avatar: '',
      winRate: 76,
      roi: 18.9,
      trades: 112,
      profitFactor: 2.5,
      isVerified: false,
      change: 'same'
    },
    {
      id: "5",
      rank: 5,
      name: 'Nicolas Blanc',
      username: '@nico_trader',
      avatar: '',
      winRate: 74,
      roi: 16.7,
      trades: 189,
      profitFactor: 2.3,
      isVerified: false,
      change: 'up'
    }
  ];
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement du classement...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="grid grid-cols-3 w-full sm:w-80">
          <TabsTrigger value="weekly">Hebdo</TabsTrigger>
          <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          <TabsTrigger value="alltime">Tout temps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-4 mt-6">
          <LeaderboardContent 
            traders={topTraders}
            following={following}
            onFollow={handleFollow}
            period="cette semaine"
          />
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4 mt-6">
          <LeaderboardContent 
            traders={topTraders}
            following={following}
            onFollow={handleFollow}
            period="ce mois-ci"
          />
        </TabsContent>
        
        <TabsContent value="alltime" className="space-y-4 mt-6">
          <LeaderboardContent 
            traders={topTraders}
            following={following}
            onFollow={handleFollow}
            period="de tous les temps"
          />
        </TabsContent>
      </Tabs>
      
      {topTraders.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparaison des performances</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={performanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trader1" name={topTraders[0]?.name} fill="#8884d8" />
                <Bar dataKey="trader2" name={topTraders[1]?.name} fill="#82ca9d" />
                <Bar dataKey="trader3" name={topTraders[2]?.name} fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface LeaderboardContentProps {
  traders: TopTrader[];
  following: string[];
  onFollow: (traderId: string) => void;
  period: string;
}

function LeaderboardContent({ traders, following, onFollow, period }: LeaderboardContentProps) {
  const { user } = useAuth();
  
  if (traders.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg">
        <Trophy className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
        <p className="mt-2 text-lg font-medium">Pas encore de top traders {period}</p>
        <p className="text-muted-foreground">Soyez le premier à rentrer dans le classement !</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Top traders {period}</h3>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Info className="h-4 w-4" />
          <span>Comment fonctionne le classement</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {traders.map((trader, index) => (
          <Card key={trader.id} className={index === 0 ? "border-primary/30 bg-primary/5" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index === 0 ? 'bg-primary text-primary-foreground' : 
                  index === 1 ? 'bg-primary/80 text-primary-foreground' : 
                  index === 2 ? 'bg-primary/60 text-primary-foreground' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {index === 0 && <Trophy className="h-5 w-5" />}
                  {index > 0 && <span className="font-bold">{trader.rank}</span>}
                </div>
                
                <div className="flex gap-3 items-center flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={trader.avatar} alt={trader.name} />
                    <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-medium">{trader.name}</h4>
                      {trader.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{trader.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs">
                  {trader.change === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {trader.change === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                  <span className={
                    trader.change === 'up' ? 'text-green-500' : 
                    trader.change === 'down' ? 'text-red-500' : 
                    'text-muted-foreground'
                  }>
                    {
                      trader.change === 'up' ? `+${trader.rank === 1 ? 0 : trader.rank - 1}` : 
                      trader.change === 'down' ? `-${trader.rank}` : 
                      '0'
                    }
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="font-bold">{trader.winRate}%</p>
                </div>
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">ROI</p>
                  <p className="font-bold text-green-500">+{trader.roi}%</p>
                </div>
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Trades</p>
                  <p className="font-bold">{trader.trades}</p>
                </div>
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Profit Factor</p>
                  <p className="font-bold">{trader.profitFactor}</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant={following.includes(trader.id) ? "outline" : "default"} 
                className="w-full"
                onClick={() => onFollow(trader.id)}
                disabled={trader.id === user?.id}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {trader.id === user?.id ? "Vous-même" : following.includes(trader.id) ? "Abonné" : "Suivre"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
