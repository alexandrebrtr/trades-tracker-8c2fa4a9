
import { AppLayout } from '@/components/layout/AppLayout';
import { CommunityContent } from '@/components/community/CommunityContent';
import { UsersRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Community() {
  const { profile } = useAuth();
  
  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UsersRound className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Communauté</h1>
              <p className="text-muted-foreground">Échanger, apprendre et progresser ensemble</p>
            </div>
          </div>
          
          {profile && (
            <div className="bg-primary/10 px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">
                Bienvenue dans la communauté, <span className="text-primary">{profile.username || 'Trader'}</span>!
              </p>
            </div>
          )}
        </div>
        
        <CommunityContent />
      </div>
    </AppLayout>
  );
}
