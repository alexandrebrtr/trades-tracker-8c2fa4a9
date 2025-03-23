
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserSettings } from '@/context/PremiumContext';
import { AlertCircle, RefreshCw, Save } from 'lucide-react';

export interface AppearanceSettingsProps {
  userSettings: UserSettings;
  onSettingsChange: (settings: UserSettings) => Promise<void>;
  onSaveSettings: (settings: UserSettings) => Promise<void>;
  isSaving: boolean;
}

export function AppearanceSettings({ 
  userSettings, 
  onSettingsChange,
  onSaveSettings,
  isSaving 
}: AppearanceSettingsProps) {
  const [settings, setSettings] = useState<UserSettings>(userSettings);
  
  // Make sure settings.theme is an object
  const themeObject = typeof settings.theme === 'string' 
    ? { primary: 'blue', background: 'light', text: 'dark', sidebar: 'dark' } 
    : settings.theme || { primary: 'blue', background: 'light', text: 'dark', sidebar: 'dark' };
  
  const handleThemeChange = (prop: string, value: string) => {
    const updatedSettings = { 
      ...settings,
      theme: { 
        ...themeObject, 
        [prop]: value 
      } 
    };
    setSettings(updatedSettings);
  };
  
  const handleSave = async () => {
    await onSaveSettings(settings);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application selon vos préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Couleur principale</Label>
            <Select 
              value={themeObject.primary} 
              onValueChange={(value) => handleThemeChange('primary', value)}
            >
              <SelectTrigger id="primary-color">
                <SelectValue placeholder="Choisir une couleur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Bleu</SelectItem>
                <SelectItem value="green">Vert</SelectItem>
                <SelectItem value="purple">Violet</SelectItem>
                <SelectItem value="red">Rouge</SelectItem>
                <SelectItem value="amber">Ambre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background-color">Couleur de fond</Label>
            <Select 
              value={themeObject.background} 
              onValueChange={(value) => handleThemeChange('background', value)}
            >
              <SelectTrigger id="background-color">
                <SelectValue placeholder="Choisir une couleur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-family">Police de caractères</Label>
            <Select 
              value={themeObject.font || 'sans'} 
              onValueChange={(value) => handleThemeChange('font', value)}
            >
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Choisir une police" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans">Sans Serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="border-radius">Arrondi des bordures</Label>
            <Select 
              value={themeObject.borderRadius || 'medium'} 
              onValueChange={(value) => handleThemeChange('borderRadius', value)}
            >
              <SelectTrigger id="border-radius">
                <SelectValue placeholder="Choisir un style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
                <SelectItem value="small">Léger</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="large">Important</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="animation">Animations</Label>
            <Select 
              value={themeObject.animation || 'subtle'} 
              onValueChange={(value) => handleThemeChange('animation', value)}
            >
              <SelectTrigger id="animation">
                <SelectValue placeholder="Choisir un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                <SelectItem value="subtle">Subtiles</SelectItem>
                <SelectItem value="medium">Moyennes</SelectItem>
                <SelectItem value="elaborate">Élaborées</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="button-style">Style des boutons</Label>
            <Select 
              value={themeObject.buttonStyle || 'solid'} 
              onValueChange={(value) => handleThemeChange('buttonStyle', value)}
            >
              <SelectTrigger id="button-style">
                <SelectValue placeholder="Choisir un style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solide</SelectItem>
                <SelectItem value="outline">Contour</SelectItem>
                <SelectItem value="ghost">Fantôme</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-950">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300">Remarque sur les paramètres</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Certains changements visuels peuvent nécessiter un rafraîchissement de la page 
                pour être complètement appliqués.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les changements
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
