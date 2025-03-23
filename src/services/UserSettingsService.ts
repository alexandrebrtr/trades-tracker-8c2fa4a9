
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { UserSettings } from '@/context/PremiumContext';

// Define default theme settings
const defaultTheme = {
  primary: 'blue',
  background: 'light',
  text: 'dark',
  sidebar: 'dark',
  font: 'sans',
  borderRadius: 'medium',
  animation: 'subtle',
  buttonStyle: 'solid',
};

export class UserSettingsService {
  // Helper method to apply theme settings to document
  static applyThemeSettings(theme: any) {
    // Implementation would go here - applying CSS variables, etc.
    console.log('Applying theme settings:', theme);
    // This is a placeholder - actual implementation would update CSS variables
  }
  
  static get defaultTheme() {
    return defaultTheme;
  }
  
  static async getUserSettings(): Promise<UserSettings | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Use the profiles table which contains settings as a JSONB column
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user settings:', error);
        return null;
      }
      
      // If settings don't exist or are empty, create default settings
      if (!profile || !profile.settings) {
        const defaultSettings: UserSettings = {
          theme: defaultTheme,
          notifications: {
            email: true,
            push: false,
          },
        };
        
        return defaultSettings;
      }
      
      return profile.settings as UserSettings;
    } catch (error) {
      console.error('Error in getUserSettings:', error);
      return null;
    }
  }
  
  static async updateUserSettings(settings: UserSettings): Promise<{ success: boolean; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update({ settings })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating user settings:', error);
        toast.error('Erreur lors de la mise à jour des paramètres utilisateur');
        return { success: false, error };
      }
      
      // Apply theme settings immediately if present
      if (settings.theme) {
        this.applyThemeSettings(settings.theme);
      }
      
      toast.success('Paramètres utilisateur mis à jour avec succès');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error in updateUserSettings:', error);
      toast.error('Erreur lors de la mise à jour des paramètres utilisateur');
      return { success: false, error };
    }
  }
  
  static async resetPassword(email: string): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Error resetting password:', error);
        toast.error('Erreur lors de la réinitialisation du mot de passe. Veuillez vérifier votre adresse email.');
        return { success: false, error };
      }
      
      toast.success('Un email de réinitialisation de mot de passe a été envoyé à votre adresse.');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      toast.error('Erreur lors de la réinitialisation du mot de passe.');
      return { success: false, error };
    }
  }
  
  static async updatePassword(newPassword: string): Promise<{ success: boolean; error: any }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        console.error('Error updating password:', error);
        toast.error('Erreur lors de la mise à jour du mot de passe.');
        return { success: false, error };
      }
      
      toast.success('Mot de passe mis à jour avec succès. Veuillez vous reconnecter.');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      toast.error('Erreur lors de la mise à jour du mot de passe.');
      return { success: false, error };
    }
  }

  static async exportUserData(): Promise<Blob | null> {
    try {
      // Fetch user profile data
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Fetch user trades
      const { data: trades, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id);
      
      if (tradesError) throw tradesError;
      
      // Combine the data
      const userData = {
        user: {
          id: user.id,
          email: user.email,
          // Use optional chaining for user metadata
          full_name: user.user_metadata?.full_name || 'N/A',
          created_at: user.created_at,
          last_sign_in: user.last_sign_in_at
        },
        profile: profile,
        trades: trades || []
      };
      
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert user and profile data to worksheet
      const userWS = XLSX.utils.json_to_sheet([userData.user]);
      XLSX.utils.book_append_sheet(wb, userWS, "User Info");
      
      // Convert profile data to worksheet
      const profileWS = XLSX.utils.json_to_sheet([userData.profile]);
      XLSX.utils.book_append_sheet(wb, profileWS, "Profile");
      
      // Convert trades data to worksheet
      const tradesWS = XLSX.utils.json_to_sheet(userData.trades);
      XLSX.utils.book_append_sheet(wb, tradesWS, "Trades");
      
      // Generate the Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
      // Convert to Blob and return
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      return blob;
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }
}
