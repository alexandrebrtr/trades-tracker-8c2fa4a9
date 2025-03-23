
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserSettings } from '@/context/PremiumContext';
import { AlertCircle, RefreshCw, Save, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState('presets');
  const [customColor, setCustomColor] = useState('#5271ff');
  
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
  
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };
  
  const applyCustomColor = () => {
    const updatedSettings = { 
      ...settings,
      theme: { 
        ...themeObject, 
        primary: customColor,
        customPrimary: customColor
      } 
    };
    setSettings(updatedSettings);
  };
  
  const handleSave = async () => {
    await onSaveSettings(settings);
  };

  const colorPresets = [
    { name: 'Bleu', value: '#5271ff', className: 'bg-blue-500' },
    { name: 'Vert', value: '#10b981', className: 'bg-green-500' },
    { name: 'Violet', value: '#8b5cf6', className: 'bg-purple-500' },
    { name: 'Rouge', value: '#ef4444', className: 'bg-red-500' },
    { name: 'Ambre', value: '#f59e0b', className: 'bg-amber-500' },
    { name: 'Rose', value: '#ec4899', className: 'bg-pink-500' },
    { name: 'Cyan', value: '#06b6d4', className: 'bg-cyan-500' },
    { name: 'Émeraude', value: '#10b981', className: 'bg-emerald-500' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Apparence
        </CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application selon vos préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="presets">Préréglages</TabsTrigger>
            <TabsTrigger value="custom">Couleurs personnalisées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Couleur principale</Label>
                <Select 
                  value={typeof themeObject.primary === 'string' ? themeObject.primary : 'blue'} 
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
                <Label htmlFor="background-color">Thème général</Label>
                <Select 
                  value={typeof themeObject.background === 'string' ? themeObject.background : 'light'} 
                  onValueChange={(value) => handleThemeChange('background', value)}
                >
                  <SelectTrigger id="background-color">
                    <SelectValue placeholder="Choisir un thème" />
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
                  value={typeof themeObject.font === 'string' ? themeObject.font : 'sans'} 
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
                  value={typeof themeObject.borderRadius === 'string' ? themeObject.borderRadius : 'medium'} 
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
                  value={typeof themeObject.animation === 'string' ? themeObject.animation : 'subtle'} 
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
                  value={typeof themeObject.buttonStyle === 'string' ? themeObject.buttonStyle : 'solid'} 
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
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6">
            <div className="p-4 border rounded-lg">
              <h3 className="text-base font-medium mb-4">Couleur personnalisée</h3>
              
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="custom-color-picker">Choisir une couleur</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input 
                        type="color" 
                        id="custom-color-picker"
                        value={customColor}
                        onChange={handleCustomColorChange}
                        className="w-16 h-8 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={customColor}
                        onChange={handleCustomColorChange}
                        className="max-w-[120px]"
                      />
                      <Button size="sm" onClick={applyCustomColor}>Appliquer</Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <Label className="mb-2">Préréglages rapides</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPresets.map((color) => (
                        <Button
                          key={color.value}
                          type="button"
                          variant="outline"
                          className="w-10 h-10 p-0 relative overflow-hidden"
                          onClick={() => {
                            setCustomColor(color.value);
                            setTimeout(() => applyCustomColor(), 100);
                          }}
                          title={color.name}
                        >
                          <div className="absolute inset-1 rounded-sm" style={{ backgroundColor: color.value }}></div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md mt-3">
                  <h4 className="text-sm font-medium mb-2">Aperçu</h4>
                  <div className="flex gap-2">
                    <div className="w-12 h-6 rounded" style={{ backgroundColor: customColor }}></div>
                    <div className="flex-1 text-xs pt-1">Couleur principale: {customColor}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
