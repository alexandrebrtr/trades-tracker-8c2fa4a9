
import { AppLayout } from '@/components/layout/AppLayout';
import { CommunityContent } from '@/components/community/CommunityContent';
import { UsersRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Community() {
  const { profile } = useAuth();
  
  // Set up real-time updates for tables used in this page
  useEffect(() => {
    console.log('Setting up real-time subscriptions in Community page');
    
    // Listen for changes in the profiles table
    const profilesChannel = supabase
      .channel('real-time-profiles')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        (payload) => {
          console.log('Profiles change detected:', payload);
        }
      )
      .subscribe((status) => {
        console.log(`Profiles subscription status: ${status}`);
      });
      
    // Listen for changes in the trades table
    const tradesChannel = supabase
      .channel('real-time-trades')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trades' }, 
        (payload) => {
          console.log('Trades change detected:', payload);
        }
      )
      .subscribe((status) => {
        console.log(`Trades subscription status: ${status}`);
      });
      
    // Listen for changes in the forum_topics table
    const forumTopicsChannel = supabase
      .channel('real-time-forum')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_topics' }, 
        (payload) => {
          console.log('Forum topic change detected:', payload);
        }
      )
      .subscribe((status) => {
        console.log(`Forum subscription status: ${status}`);
      });
      
    // Clean up subscriptions when component unmounts
    return () => {
      console.log('Cleaning up realtime subscriptions');
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
