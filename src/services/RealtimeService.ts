
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Service pour gérer les abonnements en temps réel avec Supabase
 */
export const RealtimeService = {
  /**
   * Initialise l'écoute des changements sur les profils utilisateurs
   * @param onProfileChange Callback appelé lors d'un changement de profil
   * @returns Fonction pour se désabonner
   */
  subscribeToProfiles(onProfileChange: (payload: any) => void) {
    console.log('Initialisation de l\'abonnement aux profils...');
    
    const subscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        (payload) => {
          console.log('Changement détecté sur les profils:', payload);
          onProfileChange(payload);
          
          // Notification à l'utilisateur
          const eventType = payload.eventType;
          const username = payload.new?.username || payload.old?.username || 'Utilisateur';
          
          switch(eventType) {
            case 'INSERT':
              toast.success(`${username} ajouté à la base de données`);
              break;
            case 'UPDATE':
              toast.success(`Profil de ${username} mis à jour`);
              break;
            case 'DELETE':
              toast.info(`${username} supprimé de la base de données`);
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('Statut de l\'abonnement aux profils:', status);
      });

    // Retourne une fonction pour se désabonner
    return () => {
      console.log('Désabonnement des profils...');
      supabase.removeChannel(subscription);
    };
  },

  /**
   * Met à jour le statut premium d'un utilisateur dans la base de données
   * @param userId ID de l'utilisateur
   * @param isPremium Nouveau statut premium
   * @returns Résultat de la mise à jour
   */
  async updateUserPremiumStatus(userId: string, isPremium: boolean) {
    const now = new Date().toISOString();
    const premiumExpires = isPremium 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 jours
      : null;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          premium: isPremium,
          premium_since: isPremium ? now : null,
          premium_expires: premiumExpires,
          updated_at: now
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut premium:', error);
      return { success: false, error };
    }
  },

  /**
   * Met à jour le statut de bannissement d'un utilisateur
   * @param userId ID de l'utilisateur
   * @param isBanned Nouveau statut de bannissement
   * @returns Résultat de la mise à jour
   */
  async updateUserBanStatus(userId: string, isBanned: boolean) {
    const now = new Date().toISOString();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          banned: isBanned,
          banned_at: isBanned ? now : null,
          updated_at: now
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de bannissement:', error);
      return { success: false, error };
    }
  }
};
