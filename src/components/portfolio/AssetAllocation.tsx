
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Asset {
  id: string;
  name: string;
  allocation: number;
}

interface AssetAllocationProps {
  portfolioId: string | null;
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
}

export function AssetAllocation({ portfolioId, assets, setAssets }: AssetAllocationProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetAllocation, setNewAssetAllocation] = useState('');
  const [showAssetForm, setShowAssetForm] = useState(false);

  const addAsset = async () => {
    if (!user || !portfolioId) return;
    
    const name = newAssetName.trim();
    const allocation = parseInt(newAssetAllocation);
    
    if (!name) {
      toast({
        title: "Nom invalide",
        description: "Veuillez entrer un nom d'actif valide.",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(allocation) || allocation <= 0 || allocation > 100) {
      toast({
        title: "Allocation invalide",
        description: "L'allocation doit être un nombre entre 1 et 100.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculer le total des allocations existantes
    const totalCurrentAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
    const totalAfterNewAsset = totalCurrentAllocation + allocation;
    
    if (totalAfterNewAsset > 100) {
      toast({
        title: "Allocation totale supérieure à 100%",
        description: `Le total des allocations ne peut pas dépasser 100%. Actuel: ${totalCurrentAllocation}%, Nouveau: ${allocation}%`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newAsset = {
        portfolio_id: portfolioId,
        name,
        allocation
      };
      
      const { data, error } = await supabase
        .from('asset_allocations')
        .insert([newAsset])
        .select();
      
      if (error) throw error;
      
      setAssets([...assets, { 
        id: data[0].id, 
        name: data[0].name, 
        allocation: data[0].allocation 
      }]);
      
      setNewAssetName('');
      setNewAssetAllocation('');
      setShowAssetForm(false);
      
      toast({
        title: "Actif ajouté",
        description: `${name} a été ajouté avec une allocation de ${allocation}%.`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'actif:', error);
      toast({
        title: "Erreur",
        description: "L'actif n'a pas pu être ajouté. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const deleteAsset = async (id: string) => {
    if (!user || !portfolioId) return;
    
    try {
      const { error } = await supabase
        .from('asset_allocations')
        .delete()
        .eq('id', id)
        .eq('portfolio_id', portfolioId);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      const updatedAssets = assets.filter(a => a.id !== id);
      setAssets(updatedAssets);
      
      // Redistribuer l'allocation si nécessaire
      if (updatedAssets.length > 0) {
        const totalAllocation = updatedAssets.reduce((sum, a) => sum + a.allocation, 0);
        
        if (totalAllocation < 100) {
          toast({
            title: "Actif supprimé",
            description: `L'allocation totale est maintenant de ${totalAllocation}%. Vous pouvez ajouter un nouvel actif.`,
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'actif:', error);
      toast({
        title: "Erreur",
        description: "L'actif n'a pas pu être supprimé. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des actifs</CardTitle>
        <CardDescription>
          Gérez la répartition de votre portefeuille par type d'actif
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assets.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Aucun actif défini. Ajoutez votre première allocation d'actif.
            </div>
          ) : (
            assets.map(asset => (
              <div key={asset.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{asset.name}</span>
                    <span className="text-sm">{asset.allocation}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full" 
                      style={{ width: `${asset.allocation}%` }}
                    />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2 h-8 w-8" 
                  onClick={() => deleteAsset(asset.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}

          {showAssetForm ? (
            <div className="space-y-3 mt-4 p-3 border rounded-md">
              <div className="space-y-2">
                <Label htmlFor="assetName">Nom de l'actif</Label>
                <Input
                  id="assetName"
                  placeholder="ex: Actions, Crypto, Forex..."
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetAllocation">Allocation (%)</Label>
                <Input
                  id="assetAllocation"
                  type="number"
                  placeholder="ex: 30"
                  value={newAssetAllocation}
                  onChange={(e) => setNewAssetAllocation(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAssetForm(false)}
                >
                  Annuler
                </Button>
                <Button 
                  size="sm"
                  onClick={addAsset}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => setShowAssetForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un actif
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
