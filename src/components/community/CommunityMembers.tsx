
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeCheck, Search, TrendingUp, UserPlus } from 'lucide-react';

const members = [
  {
    id: 1,
    name: 'Emma Bernard',
    username: '@emma_trader',
    avatar: '',
    bio: 'Day trader spécialisée en actions et indices. 5 ans d'expérience.',
    trades: 876,
    followers: 245,
    winRate: 68,
    isVerified: true,
    trending: true
  },
  {
    id: 2,
    name: 'Thomas Martin',
    username: '@tomtrader',
    avatar: '',
    bio: 'Investisseur crypto & swing trader. Analyste technique certifié.',
    trades: 532,
    followers: 189,
    winRate: 72
  },
  {
    id: 3,
    name: 'Sophie Dubois',
    username: '@sophmarket',
    avatar: '',
    bio: 'Position trader actions. Je partage mes analyses et résultats chaque semaine.',
    trades: 327,
    followers: 97,
    winRate: 65
  },
  {
    id: 4,
    name: 'Nicolas Klein',
    username: '@niko_invest',
    avatar: '',
    bio: 'Trader options et futures. Formateur en gestion des risques.',
    trades: 1204,
    followers: 567,
    winRate: 74,
    isVerified: true
  },
  {
    id: 5,
    name: 'Laura Blanc',
    username: '@lblanc_trade',
    avatar: '',
    bio: 'Day & swing trader. J'analyse principalement les marchés européens.',
    trades: 689,
    followers: 215,
    winRate: 69,
    trending: true
  },
  {
    id: 6,
    name: 'Jean Moreau',
    username: '@jean_scalp',
    avatar: '',
    bio: 'Scalper forex et indices. Stratégies intraday uniquement.',
    trades: 2341,
    followers: 412,
    winRate: 62
  }
];

export function CommunityMembers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('followers');
  const [following, setFollowing] = useState<number[]>([]);
  
  const handleFollow = (memberId: number) => {
    if (following.includes(memberId)) {
      setFollowing(following.filter(id => id !== memberId));
    } else {
      setFollowing([...following, memberId]);
    }
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
      } else {
        return b.trades - a.trades;
      }
    });
  
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
              <SelectItem value="trades">Nombre de trades</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
                  <p className="text-xs text-muted-foreground">Abonnés</p>
                  <p className="font-bold">{member.followers}</p>
                </div>
              </div>
              
              <Button 
                variant={following.includes(member.id) ? "outline" : "default"} 
                className="w-full"
                onClick={() => handleFollow(member.id)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {following.includes(member.id) ? "Abonné" : "Suivre"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
