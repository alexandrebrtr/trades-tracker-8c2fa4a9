
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserSettings } from '@/context/PremiumContext';
import { UserSettingsService } from './UserSettingsService';

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
          
          // Safely access username with type checking and defaults
          const newUsername = payload.new && typeof payload.new === 'object' ? 
            (payload.new as Record<string, any>).username || 'Utilisateur' : 'Utilisateur';
            
          const oldUsername = payload.old && typeof payload.old === 'object' ? 
            (payload.old as Record<string, any>).username || 'Utilisateur' : 'Utilisateur';
          
          // Use the appropriate username based on the event type
          const username = eventType === 'DELETE' ? oldUsername : newUsername;
          
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
   * S'abonne aux changements dans les trades pour mettre à jour le solde du portefeuille
   * @param userId ID de l'utilisateur
   * @param onBalanceChange Callback appelé lors d'un changement de solde
   * @returns Fonction pour se désabonner
   */
  subscribeToTradesBalanceUpdates(userId: string, onBalanceChange: (newBalance: number) => void) {
    console.log('Initialisation de l\'abonnement aux trades pour le solde...');
    
    const subscription = supabase
      .channel('trades-balance-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'trades',
          filter: `user_id=eq.${userId}`
        }, 
        async () => {
          try {
            // Récupérer le solde mis à jour
            const { data, error } = await supabase
              .from('profiles')
              .select('balance')
              .eq('id', userId)
              .single();
            
            if (error) throw error;
            
            if (data && typeof data.balance === 'number') {
              onBalanceChange(data.balance);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du solde mis à jour:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Statut de l\'abonnement aux trades:', status);
      });

    // Retourne une fonction pour se désabonner
    return () => {
      console.log('Désabonnement des trades...');
      supabase.removeChannel(subscription);
    };
  },

  /**
   * S'abonne aux changements de paramètres utilisateur
   * @param userId ID de l'utilisateur
   * @param onSettingsChange Callback appelé lors d'un changement de paramètres
   * @returns Fonction pour se désabonner
   */
  subscribeToUserSettings(userId: string, onSettingsChange: (settings: UserSettings) => void) {
    console.log('Initialisation de l\'abonnement aux paramètres utilisateur...');
    
    const subscription = supabase
      .channel('user-settings-updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${userId}`
        }, 
        async (payload) => {
          try {
            // Si les paramètres sont présents dans le payload, les utiliser directement
            if (payload.new && typeof payload.new === 'object' && 'settings' in payload.new) {
              const settings = (payload.new as Record<string, any>).settings as UserSettings;
              
              if (settings) {
                console.log('Paramètres utilisateur mis à jour (depuis payload):', settings);
                onSettingsChange(settings);
                
                // Appliquer les paramètres de thème immédiatement
                if (settings.theme) {
                  UserSettingsService.applyThemeSettings(settings.theme);
                }
                return;
              }
            }
            
            // Sinon, récupérer les paramètres mis à jour
            const settings = await UserSettingsService.getUserSettings(userId);
            
            if (settings) {
              console.log('Paramètres utilisateur mis à jour (depuis API):', settings);
              onSettingsChange(settings);
              
              // Appliquer les paramètres de thème immédiatement
              if (settings.theme) {
                UserSettingsService.applyThemeSettings(settings.theme);
              }
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des paramètres utilisateur mis à jour:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Statut de l\'abonnement aux paramètres utilisateur:', status);
      });

    // Retourne une fonction pour se désabonner
    return () => {
      console.log('Désabonnement des paramètres utilisateur...');
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
