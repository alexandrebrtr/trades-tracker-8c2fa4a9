
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, TrendingUp, TrendingDown, MessageCircle, Heart } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'trade' | 'comment' | 'like' | 'follow';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return activities.find(a => a.id === type)?.metadata?.pnl > 0 
          ? <TrendingUp className="h-4 w-4 text-green-500" /> 
          : <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'follow':
        return <CalendarClock className="h-4 w-4 text-primary" />;
      default:
        return <CalendarClock className="h-4 w-4 text-primary" />;
    }
  };
  
  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'trade':
        return (
          <Badge variant="outline" className="ml-auto bg-blue-500/10 text-blue-500 border-blue-500/20">
            Trade
          </Badge>
        );
      case 'comment':
        return (
          <Badge variant="outline" className="ml-auto bg-purple-500/10 text-purple-500 border-purple-500/20">
            Comment
          </Badge>
        );
      case 'like':
        return (
          <Badge variant="outline" className="ml-auto bg-red-500/10 text-red-500 border-red-500/20">
            Like
          </Badge>
        );
      case 'follow':
        return (
          <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-500 border-green-500/20">
            Follow
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Pas d'activité récente à afficher
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 py-2 border-b last:border-0">
                <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="font-medium text-sm truncate">{activity.title}</p>
                    {getActivityBadge(activity.type)}
                  </div>
                  
                  {activity.description && (
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(activity.timestamp, 'PPp')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
