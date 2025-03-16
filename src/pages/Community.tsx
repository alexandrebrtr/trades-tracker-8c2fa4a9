
import { AppLayout } from '@/components/layout/AppLayout';
import { CommunityContent } from '@/components/community/CommunityContent';
import { UsersRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Community() {
  const { profile } = useAuth();
  
  // Activer les mises à jour en temps réel pour les tables utilisées dans cette page
  useEffect(() => {
    // Activer les canaux pour écouter les changements dans les tables
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        (payload) => {
          console.log('Profiles change detected:', payload);
        }
      )
      .subscribe();
      
    const tradesChannel = supabase
      .channel('trades-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trades' }, 
        (payload) => {
          console.log('Trades change detected:', payload);
        }
      )
      .subscribe();
      
    const forumTopicsChannel = supabase
      .channel('forum-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_topics' }, 
        (payload) => {
          console.log('Forum topic change detected:', payload);
        }
      )
      .subscribe();
      
    // Nettoyer les abonnements
    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(tradesChannel);
      supabase.removeChannel(forumTopicsChannel);
    };
  }, []);
  
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
