
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
   * S'abonne aux changements sur les trades
   * @param userId ID de l'utilisateur
   * @param onTradeChange Callback appelé lors d'un changement de trade
   * @returns Fonction pour se désabonner
   */
  subscribeToTrades(userId: string, onTradeChange: (payload: any) => void) {
    console.log('Initialisation de l\'abonnement aux trades pour l\'utilisateur:', userId);
    
    const subscription = supabase
      .channel('trades-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'trades',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Changement détecté sur les trades:', payload);
          onTradeChange(payload);
          
          // Notification à l'utilisateur
          const eventType = payload.eventType;
          
          // Safely access symbol with type checking and defaults
          const symbol = payload.new && typeof payload.new === 'object' ? 
            (payload.new as Record<string, any>).symbol || 'Unknown' : 'Unknown';
            
          switch(eventType) {
            case 'INSERT':
              toast.success(`Nouveau trade ${symbol} ajouté`);
              break;
            case 'UPDATE':
              toast.success(`Trade ${symbol} mis à jour`);
              break;
            case 'DELETE':
              toast.info(`Trade supprimé`);
              break;
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
   * Synchronise les trades depuis un broker externe (Binance, etc.)
   * @param userId ID de l'utilisateur
   * @param broker Informations du broker
   * @returns Résultat de la synchronisation
   */
  async syncTradesFromBroker(userId: string, broker: {
    name: string;
    apiKey: string;
    secretKey: string;
  }) {
    console.log(`Synchronisation des trades depuis ${broker.name} pour l'utilisateur ${userId}...`);
    
    try {
      // Dans une application réelle, cette partie appellerait une fonction Edge pour
      // récupérer les trades du broker en utilisant les clés API
      // Ici, on simule une requête réussie
      
      toast.info(`Connexion à ${broker.name} en cours...`);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler l'insertion de quelques trades de démonstration
      const now = new Date();
      const demoTrades = [
        {
          user_id: userId,
          symbol: 'BTC/USDT',
          type: 'long',
          entry_price: 57000,
          exit_price: 58500,
          size: 0.1,
          pnl: 150,
          date: new Date(now.getTime() - 3600000).toISOString(), // 1 heure avant
          strategy: 'Tendance'
        },
        {
          user_id: userId,
          symbol: 'ETH/USDT',
          type: 'short',
          entry_price: 3200,
          exit_price: 3150,
          size: 0.5,
          pnl: 25,
          date: new Date(now.getTime() - 7200000).toISOString(), // 2 heures avant
          strategy: 'Contre-tendance'
        }
      ];
      
      // Insérer les trades de démonstration
      for (const trade of demoTrades) {
        const { error } = await supabase
          .from('trades')
          .insert(trade);
          
        if (error) throw error;
      }
      
      toast.success(`Synchronisation avec ${broker.name} réussie !`);
      return { success: true, tradesCount: demoTrades.length };
    } catch (error) {
      console.error('Erreur lors de la synchronisation des trades:', error);
      toast.error(`Erreur lors de la synchronisation avec ${broker.name}`);
      return { success: false, error };
    }
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
