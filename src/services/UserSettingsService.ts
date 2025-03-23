
import { supabase } from '@/integrations/supabase/client';
import { UserSettings } from '@/context/PremiumContext';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import * as XLSX from 'xlsx';

/**
 * Service pour gérer les paramètres utilisateur
 */
export const UserSettingsService = {
  // Thèmes par défaut
  defaultTheme: {
    primary: '#0f172a',
    background: '#ffffff',
    text: '#1e293b',
    sidebar: '#f8fafc',
    font: 'Inter',
    borderRadius: '8px',
    animation: 'none',
    buttonStyle: 'default'
  },
  
  // Options supplémentaires pour personnalisation
  fontOptions: ['Inter', 'Roboto', 'Montserrat', 'Open Sans', 'Lato'],
  borderRadiusOptions: ['0px', '4px', '8px', '12px', '16px'],
  animationOptions: ['none', 'fade', 'slide', 'bounce'],
  
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
    
    // Apply additional customizations if they exist
    if (themeSettings.font) {
      root.style.setProperty('--font-family', themeSettings.font);
    }
    
    if (themeSettings.borderRadius) {
      root.style.setProperty('--border-radius', themeSettings.borderRadius);
    }
    
    if (themeSettings.animation) {
      root.style.setProperty('--animation-style', themeSettings.animation);
    }
    
    if (themeSettings.buttonStyle) {
      root.style.setProperty('--button-style', themeSettings.buttonStyle);
    }
    
    console.log('Paramètres de thème appliqués:', themeSettings);
  },
  
  /**
   * Liste des options de style pour les boutons
   */
  buttonStyleOptions: [
    'default',
    'soft', 
    'outline', 
    'gradient',
    'rounded'
  ],

  /**
   * Exporte les données de l'utilisateur au format Excel
   * @param userId ID de l'utilisateur
   */
  async exportUserData(userId: string): Promise<Blob | null> {
    try {
      // Récupérer les données du profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Récupérer les trades de l'utilisateur
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId);

      if (tradesError) throw tradesError;

      // Créer un nouveau classeur Excel
      const workbook = XLSX.utils.book_new();

      // Créer une feuille pour les informations de profil
      const profileSheet = XLSX.utils.json_to_sheet([{
        ID: profileData.id,
        Username: profileData.username,
        Email: profileData.email,
        FullName: profileData.full_name,
        Balance: profileData.balance,
        Premium: profileData.premium ? 'Oui' : 'Non',
        PremiumSince: profileData.premium_since,
        PremiumExpires: profileData.premium_expires,
        CreatedAt: profileData.created_at,
        UpdatedAt: profileData.updated_at
      }]);

      // Ajouter la feuille de profil au classeur
      XLSX.utils.book_append_sheet(workbook, profileSheet, 'Profil');

      // Créer une feuille pour les trades
      if (tradesData && tradesData.length > 0) {
        const tradesSheet = XLSX.utils.json_to_sheet(tradesData);
        XLSX.utils.book_append_sheet(workbook, tradesSheet, 'Trades');
      }

      // Créer une feuille pour les paramètres
      if (profileData.settings) {
        const settingsSheet = XLSX.utils.json_to_sheet([profileData.settings]);
        XLSX.utils.book_append_sheet(workbook, settingsSheet, 'Paramètres');
      }

      // Convertir le classeur en blob
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      return blob;
    } catch (error) {
      console.error('Erreur lors de l\'exportation des données:', error);
      toast.error('Erreur lors de l\'exportation des données');
      return null;
    }
  },

  /**
   * Démarrer le processus de réinitialisation du mot de passe
   * @param email Email de l'utilisateur
   */
  async resetPassword(email: string): Promise<{ success: boolean, error?: any }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Email de réinitialisation envoyé avec succès');
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      toast.error('Erreur lors de l\'envoi de l\'email de réinitialisation');
      return { success: false, error };
    }
  },
  
  /**
   * Met à jour le mot de passe de l'utilisateur
   * @param newPassword Nouveau mot de passe
   */
  async updatePassword(newPassword: string): Promise<{ success: boolean, error?: any }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Mot de passe mis à jour avec succès');
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      toast.error('Erreur lors de la mise à jour du mot de passe');
      return { success: false, error };
    }
  }
};
