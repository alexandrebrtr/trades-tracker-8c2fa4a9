
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  avatar?: string;
  trades?: number;
  winRate?: number;
  isFollowing?: boolean;
}

interface FollowSectionProps {
  users: User[];
  title: string;
  emptyMessage: string;
  onToggleFollow?: (userId: string) => void;
}

export function FollowSection({ users = [], title, emptyMessage, onToggleFollow }: FollowSectionProps) {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    // Naviguer vers le profil de l'utilisateur
    navigate(`/profile/${userId}`);
  };

  const handleFollowToggle = (e: React.MouseEvent, userId: string) => {
    // Empêcher la propagation pour ne pas déclencher handleUserClick
    e.stopPropagation();
    if (onToggleFollow) {
      onToggleFollow(userId);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {emptyMessage}
          </p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center space-x-3 py-2 border-b last:border-0 hover:bg-secondary/20 rounded-md px-2 cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.trades ?? 0} trades · {user.winRate ?? 0}% win rate
                  </p>
                </div>
                
                <Button 
                  variant={user.isFollowing ? "outline" : "default"} 
                  size="sm"
                  onClick={(e) => handleFollowToggle(e, user.id)}
                >
                  {user.isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
