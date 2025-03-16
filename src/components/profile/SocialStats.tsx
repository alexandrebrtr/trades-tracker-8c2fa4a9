
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Award, MessageCircle, Share, Heart } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';

interface SocialStatsProps {
  followersCount?: number;
  followingCount?: number;
  tradesCount?: number;
  winRate?: number;
  likesReceived?: number;
  commentsCount?: number;
}

export function SocialStats({
  followersCount = 0,
  followingCount = 0,
  tradesCount = 0,
  winRate = 0,
  likesReceived = 0,
  commentsCount = 0
}: SocialStatsProps) {
  const { isPremium } = usePremium();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          Statistiques Sociales
          {isPremium && (
            <Badge variant="outline" className="ml-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              Premium
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2">
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">{followersCount}</span>
              <span className="text-sm text-muted-foreground">Followers</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">{followingCount}</span>
              <span className="text-sm text-muted-foreground">Following</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-xl font-bold">{tradesCount}</span>
              <span className="text-sm text-muted-foreground">Trades</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-yellow-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="text-xl font-bold">{winRate}%</span>
              <span className="text-sm text-muted-foreground">Win Rate</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-red-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-xl font-bold">{likesReceived}</span>
              <span className="text-sm text-muted-foreground">Likes</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-xl font-bold">{commentsCount}</span>
              <span className="text-sm text-muted-foreground">Comments</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
