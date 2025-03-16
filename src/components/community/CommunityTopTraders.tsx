
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Trophy, TrendingUp, TrendingDown, Info, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const topTraders = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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

const performanceData = [
  { name: 'Win Rate', trader1: 87, trader2: 82, trader3: 79 },
  { name: 'ROI', trader1: 24.8, trader2: 21.3, trader3: 19.5 },
  { name: 'Profit Factor', trader1: 3.2, trader2: 2.9, trader3: 2.7 }
];

export function CommunityTopTraders() {
  const [tabValue, setTabValue] = useState('monthly');
  const [following, setFollowing] = useState<number[]>([]);
  
  const handleFollow = (traderId: number) => {
    if (following.includes(traderId)) {
      setFollowing(following.filter(id => id !== traderId));
    } else {
      setFollowing([...following, traderId]);
    }
  };
  
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
              <Bar dataKey="trader1" name={topTraders[0].name} fill="#8884d8" />
              <Bar dataKey="trader2" name={topTraders[1].name} fill="#82ca9d" />
              <Bar dataKey="trader3" name={topTraders[2].name} fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

interface LeaderboardContentProps {
  traders: any[];
  following: number[];
  onFollow: (traderId: number) => void;
  period: string;
}

function LeaderboardContent({ traders, following, onFollow, period }: LeaderboardContentProps) {
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
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {following.includes(trader.id) ? "Abonné" : "Suivre"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
