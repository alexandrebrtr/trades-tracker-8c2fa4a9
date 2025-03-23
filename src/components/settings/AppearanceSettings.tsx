
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Save, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserSettingsService } from '@/services/UserSettingsService';
import { UserSettings } from '@/context/PremiumContext';

interface AppearanceSettingsProps {
  userSettings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onSaveSettings: () => Promise<void>;
  isSaving: boolean;
}

export function AppearanceSettings({ 
  userSettings, 
  onSettingsChange, 
  onSaveSettings,
  isSaving 
}: AppearanceSettingsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('colors');
  const [isResetting, setIsResetting] = useState(false);
  
  const handleColorChange = (color: string, type: 'primary' | 'background' | 'text' | 'sidebar') => {
    if (!userSettings?.theme || typeof userSettings.theme === 'string') return;
    
    onSettingsChange({
      ...userSettings,
      theme: {
        ...userSettings.theme,
        [type]: color
      }
    });
  };
  
  const handleFontChange = (font: string) => {
    if (!userSettings?.theme || typeof userSettings.theme === 'string') return;
    
    onSettingsChange({
      ...userSettings,
      theme: {
        ...userSettings.theme,
        font
      }
    });
  };
  
  const handleBorderRadiusChange = (borderRadius: string) => {
    if (!userSettings?.theme || typeof userSettings.theme === 'string') return;
    
    onSettingsChange({
      ...userSettings,
      theme: {
        ...userSettings.theme,
        borderRadius
      }
    });
  };
  
  const handleAnimationChange = (animation: string) => {
    if (!userSettings?.theme || typeof userSettings.theme === 'string') return;
    
    onSettingsChange({
      ...userSettings,
      theme: {
        ...userSettings.theme,
        animation
      }
    });
  };
  
  const handleButtonStyleChange = (buttonStyle: string) => {
    if (!userSettings?.theme || typeof userSettings.theme === 'string') return;
    
    onSettingsChange({
      ...userSettings,
      theme: {
        ...userSettings.theme,
        buttonStyle
      }
    });
  };

  const handleResetToDefault = async () => {
    if (!user) return;
    
    setIsResetting(true);
    try {
      const result = await UserSettingsService.resetThemeToDefault(user.id, userSettings);
      if (result.success && result.settings) {
        onSettingsChange(result.settings);
      }
    } finally {
      setIsResetting(false);
    }
  };
  
  // Get current values with fallbacks to default
  const currentTheme = typeof userSettings?.theme === 'object' ? userSettings.theme : UserSettingsService.defaultTheme;
  const currentFont = currentTheme.font || 'Inter';
  const currentBorderRadius = currentTheme.borderRadius || '8px';
  const currentAnimation = currentTheme.animation || 'none';
  const currentButtonStyle = currentTheme.buttonStyle || 'default';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence de l'application</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application selon vos préférences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="colors">Couleurs</TabsTrigger>
            <TabsTrigger value="typography">Typographie</TabsTrigger>
            <TabsTrigger value="components">Composants</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <div className="space-y-4">
              <div>
                <Label htmlFor="primary-color" className="block mb-2">Couleur primaire</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="primary-color"
                    type="color"
                    value={currentTheme.primary}
                    onChange={(e) => handleColorChange(e.target.value, 'primary')}
                    className="w-14 h-14 p-1 cursor-pointer"
                  />
                  <Input 
                    value={currentTheme.primary}
                    onChange={(e) => handleColorChange(e.target.value, 'primary')}
                    className="font-mono"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="background-color" className="block mb-2">Couleur de fond</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="background-color"
                    type="color"
                    value={currentTheme.background}
                    onChange={(e) => handleColorChange(e.target.value, 'background')}
                    className="w-14 h-14 p-1 cursor-pointer"
                  />
                  <Input 
                    value={currentTheme.background}
                    onChange={(e) => handleColorChange(e.target.value, 'background')}
                    className="font-mono"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="text-color" className="block mb-2">Couleur du texte</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="text-color"
                    type="color"
                    value={currentTheme.text}
                    onChange={(e) => handleColorChange(e.target.value, 'text')}
                    className="w-14 h-14 p-1 cursor-pointer"
                  />
                  <Input 
                    value={currentTheme.text}
                    onChange={(e) => handleColorChange(e.target.value, 'text')}
                    className="font-mono"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="sidebar-color" className="block mb-2">Couleur de la barre latérale</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="sidebar-color"
                    type="color"
                    value={currentTheme.sidebar}
                    onChange={(e) => handleColorChange(e.target.value, 'sidebar')}
                    className="w-14 h-14 p-1 cursor-pointer"
                  />
                  <Input 
                    value={currentTheme.sidebar}
                    onChange={(e) => handleColorChange(e.target.value, 'sidebar')}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="typography">
            <div className="space-y-4">
              <div>
                <Label htmlFor="font-family" className="block mb-2">Police de caractères</Label>
                <Select value={currentFont} onValueChange={handleFontChange}>
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Choisissez une police" />
                  </SelectTrigger>
                  <SelectContent>
                    {UserSettingsService.fontOptions.map(font => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-4 p-4 border rounded-md">
                  <p className="mb-2 text-muted-foreground text-sm">Aperçu:</p>
                  <p style={{ fontFamily: currentFont }} className="text-2xl">Le renard brun rapide saute par-dessus le chien paresseux</p>
                  <p style={{ fontFamily: currentFont }} className="mt-2">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="components">
            <div className="space-y-4">
              <div>
                <Label htmlFor="border-radius" className="block mb-2">Rayon des bordures</Label>
                <Select value={currentBorderRadius} onValueChange={handleBorderRadiusChange}>
                  <SelectTrigger id="border-radius">
                    <SelectValue placeholder="Choisissez un rayon de bordure" />
                  </SelectTrigger>
                  <SelectContent>
                    {UserSettingsService.borderRadiusOptions.map(radius => (
                      <SelectItem key={radius} value={radius}>{radius}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map(i => (
                    <div 
                      key={i} 
                      className="p-4 bg-primary/10 flex items-center justify-center h-20"
                      style={{ borderRadius: currentBorderRadius }}
                    >
                      Exemple
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <Label htmlFor="button-style" className="block mb-2">Style des boutons</Label>
                <RadioGroup 
                  value={currentButtonStyle} 
                  onValueChange={handleButtonStyleChange}
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  {UserSettingsService.buttonStyleOptions.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <RadioGroupItem value={style} id={`button-style-${style}`} />
                      <Label htmlFor={`button-style-${style}`}>{style.charAt(0).toUpperCase() + style.slice(1)}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button
                    className={currentButtonStyle === 'soft' ? 'bg-primary/80 hover:bg-primary/90' : 
                             currentButtonStyle === 'outline' ? 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10' :
                             currentButtonStyle === 'gradient' ? 'bg-gradient-to-r from-primary to-primary/60' :
                             currentButtonStyle === 'rounded' ? 'rounded-full px-6' : ''}
                  >
                    Bouton primaire
                  </Button>
                  
                  <Button variant="secondary"
                    className={currentButtonStyle === 'soft' ? 'bg-secondary/80 hover:bg-secondary/90' : 
                             currentButtonStyle === 'outline' ? 'bg-transparent border-2 border-secondary text-secondary hover:bg-secondary/10' :
                             currentButtonStyle === 'gradient' ? 'bg-gradient-to-r from-secondary to-secondary/60' :
                             currentButtonStyle === 'rounded' ? 'rounded-full px-6' : ''}
                  >
                    Bouton secondaire
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="animations">
            <div className="space-y-4">
              <div>
                <Label htmlFor="animation-style" className="block mb-2">Style d'animation</Label>
                <Select value={currentAnimation} onValueChange={handleAnimationChange}>
                  <SelectTrigger id="animation-style">
                    <SelectValue placeholder="Choisissez un style d'animation" />
                  </SelectTrigger>
                  <SelectContent>
                    {UserSettingsService.animationOptions.map(animation => (
                      <SelectItem key={animation} value={animation}>
                        {animation.charAt(0).toUpperCase() + animation.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-4">
                  <p className="text-muted-foreground text-sm mb-2">L'animation s'appliquera aux transitions et aux interactions.</p>
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button 
                      variant="outline"
                      className={`transition-all duration-300 ${
                        currentAnimation === 'fade' ? 'hover:opacity-80' :
                        currentAnimation === 'slide' ? 'hover:translate-x-1' :
                        currentAnimation === 'bounce' ? 'hover:animate-bounce' : ''
                      }`}
                    >
                      Survol pour voir l'effet
                    </Button>
                    
                    <Button 
                      variant="default"
                      className={`transition-all duration-300 ${
                        currentAnimation === 'fade' ? 'hover:opacity-80' :
                        currentAnimation === 'slide' ? 'hover:translate-x-1' :
                        currentAnimation === 'bounce' ? 'hover:animate-bounce' : ''
                      }`}
                    >
                      Effet sur bouton primaire
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetToDefault}
          disabled={isResetting || isSaving}
        >
          {isResetting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Réinitialisation...
            </>
          ) : (
            <>
              <RotateCcw className="mr-2 h-4 w-4" />
              Réinitialiser les paramètres
            </>
          )}
        </Button>
        
        <Button 
          onClick={onSaveSettings}
          disabled={isResetting || isSaving}
        >
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
