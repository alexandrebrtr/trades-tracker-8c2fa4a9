
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Award, MessageCircle, Share, Heart } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialStatsProps {
  userId: string;
  followersCount?: number;
  followingCount?: number;
  tradesCount?: number;
  winRate?: number;
  likesReceived?: number;
  commentsCount?: number;
  onShowFollowers?: () => void;
  onShowFollowing?: () => void;
  onShowLikes?: () => void;
  onShowComments?: () => void;
}

export function SocialStats({
  userId,
  followersCount = 0,
  followingCount = 0,
  tradesCount = 0,
  winRate = 0,
  likesReceived = 0,
  commentsCount = 0,
  onShowFollowers,
  onShowFollowing,
  onShowLikes,
  onShowComments
}: SocialStatsProps) {
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [tradeCount, setTradeCount] = useState(tradesCount);
  const [calculatedWinRate, setCalculatedWinRate] = useState(winRate);

  // Fetch actual trade count from database
  useEffect(() => {
    if (userId) {
      const fetchTradeStats = async () => {
        try {
          // Get trade count
          const { count, error: countError } = await supabase
            .from('trades')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
          
          if (countError) throw countError;
          
          if (count !== null) {
            setTradeCount(count);
            
            // Calculate win rate
            const { data: trades, error: tradesError } = await supabase
              .from('trades')
              .select('pnl')
              .eq('user_id', userId);
            
            if (tradesError) throw tradesError;
            
            if (trades && trades.length > 0) {
              const winningTrades = trades.filter(trade => trade.pnl > 0).length;
              const newWinRate = (winningTrades / trades.length) * 100;
              setCalculatedWinRate(Math.round(newWinRate));
            }
          }
        } catch (error) {
          console.error('Error fetching trade stats:', error);
        }
      };
      
      fetchTradeStats();
    }
  }, [userId]);

  const handleInteraction = (
    isPremiumFeature: boolean,
    callback?: () => void
  ) => {
    if (isPremiumFeature && !isPremium) {
      toast.error("Cette fonctionnalité est réservée aux utilisateurs premium", {
        description: "Passez au mode premium pour accéder à toutes les fonctionnalités sociales.",
        action: {
          label: "Premium",
          onClick: () => navigate("/premium")
        }
      });
      return;
    }
    
    if (callback) {
      callback();
    }
  };

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
          <div 
            className="text-center cursor-pointer hover:bg-secondary/50 rounded-lg p-2 transition-colors"
            onClick={() => handleInteraction(true, onShowFollowers)}
          >
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">{followersCount}</span>
              <span className="text-sm text-muted-foreground">Followers</span>
            </div>
          </div>
          
          <div 
            className="text-center cursor-pointer hover:bg-secondary/50 rounded-lg p-2 transition-colors"
            onClick={() => handleInteraction(true, onShowFollowing)}
          >
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
              <span className="text-xl font-bold">{tradeCount}</span>
              <span className="text-sm text-muted-foreground">Trades</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-yellow-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="text-xl font-bold">{calculatedWinRate}%</span>
              <span className="text-sm text-muted-foreground">Win Rate</span>
            </div>
          </div>
          
          <div 
            className="text-center cursor-pointer hover:bg-secondary/50 rounded-lg p-2 transition-colors"
            onClick={() => handleInteraction(true, onShowLikes)}
          >
            <div className="flex flex-col items-center">
              <div className="bg-red-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-xl font-bold">{likesReceived}</span>
              <span className="text-sm text-muted-foreground">Likes</span>
            </div>
          </div>
          
          <div 
            className="text-center cursor-pointer hover:bg-secondary/50 rounded-lg p-2 transition-colors"
            onClick={() => handleInteraction(true, onShowComments)}
          >
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
