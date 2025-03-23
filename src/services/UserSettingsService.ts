import { supabase } from '@/integrations/supabase/client';
import { UserSettings } from '@/context/PremiumContext';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

/**
 * Service pour gérer les paramètres utilisateur
 */
export const UserSettingsService = {
  // Thèmes par défaut
  defaultTheme: {
    primary: '#0f172a',
    background: '#ffffff',
    text: '#1e293b',
    sidebar: '#f8fafc'
  },
  
  /**
   * Récupère les paramètres de l'utilisateur
   * @param userId ID de l'utilisateur
   * @returns Paramètres de l'utilisateur
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      return data?.settings as UserSettings || null;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres utilisateur:', error);
      return null;
    }
  },

  /**
   * Met à jour les paramètres de l'utilisateur
   * @param userId ID de l'utilisateur
   * @param settings Nouveaux paramètres
   * @returns Résultat de la mise à jour
   */
  async updateUserSettings(userId: string, settings: UserSettings): Promise<{ success: boolean, error?: any }> {
    try {
      // Convert UserSettings to Json type to satisfy TypeScript
      const settingsJson: Json = settings as unknown as Json;
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          settings: settingsJson,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Paramètres enregistrés avec succès');
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres utilisateur:', error);
      toast.error('Erreur lors de l\'enregistrement des paramètres');
      return { success: false, error };
    }
  },

  /**
   * Réinitialise le thème aux valeurs par défaut
   * @param userId ID de l'utilisateur
   * @param currentSettings Paramètres actuels
   * @returns Paramètres mis à jour
   */
  async resetThemeToDefault(userId: string, currentSettings: UserSettings): Promise<{ success: boolean, settings?: UserSettings, error?: any }> {
    try {
      // Créer une copie des paramètres actuels
      const updatedSettings: UserSettings = { ...currentSettings };
      
      // Appliquer le thème par défaut
      updatedSettings.theme = this.defaultTheme;
      
      // Mettre à jour les paramètres
      const result = await this.updateUserSettings(userId, updatedSettings);
      
      if (result.success) {
        // Appliquer le thème
        this.applyThemeSettings(this.defaultTheme);
        toast.success('Thème réinitialisé avec succès');
        return { success: true, settings: updatedSettings };
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du thème:', error);
      toast.error('Erreur lors de la réinitialisation du thème');
      return { success: false, error };
    }
  },

  /**
   * Applique les paramètres de thème à l'interface utilisateur
   * @param themeSettings Paramètres de thème
   */
  applyThemeSettings(themeSettings: UserSettings['theme']) {
    if (!themeSettings) return;
    
    // Check if themeSettings is a string (theme name) or an object (custom theme)
    if (typeof themeSettings === 'string') {
      console.log('Applying theme by name:', themeSettings);
      // Handle string theme (e.g., "dark", "light", etc.)
      return;
    }
    
    // Applique les couleurs personnalisées via CSS variables
    const root = document.documentElement;
    
    if (themeSettings.primary) {
      root.style.setProperty('--primary-color', themeSettings.primary);
    }
    
    if (themeSettings.background) {
      root.style.setProperty('--background-color', themeSettings.background);
    }
    
    if (themeSettings.text) {
      root.style.setProperty('--text-color', themeSettings.text);
    }
    
    if (themeSettings.sidebar) {
      root.style.setProperty('--sidebar-color', themeSettings.sidebar);
    }
    
    console.log('Paramètres de thème appliqués:', themeSettings);
  }
};
