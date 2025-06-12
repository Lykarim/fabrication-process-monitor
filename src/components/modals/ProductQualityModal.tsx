
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { useCreateProductQualityData, useUpdateProductQualityData } from '@/hooks/useProductQualityData';
import { Tables } from '@/integrations/supabase/types';

type ProductQualityData = Tables<'product_quality_data'>;

interface ProductQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  productQuality?: ProductQualityData;
}

export function ProductQualityModal({ isOpen, onClose, productQuality }: ProductQualityModalProps) {
  const [formData, setFormData] = useState({
    product_name: '',
    batch_number: '',
    density: 0,
    viscosity: 0,
    sulfur_content: 0,
    octane_rating: 0,
    quality_status: 'pending',
    test_date: new Date().toISOString().split('T')[0]
  });

  const createMutation = useCreateProductQualityData();
  const updateMutation = useUpdateProductQualityData();

  useEffect(() => {
    if (productQuality) {
      setFormData({
        product_name: productQuality.product_name,
        batch_number: productQuality.batch_number,
        density: productQuality.density || 0,
        viscosity: productQuality.viscosity || 0,
        sulfur_content: productQuality.sulfur_content || 0,
        octane_rating: productQuality.octane_rating || 0,
        quality_status: productQuality.quality_status || 'pending',
        test_date: new Date(productQuality.test_date).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        product_name: '',
        batch_number: '',
        density: 0,
        viscosity: 0,
        sulfur_content: 0,
        octane_rating: 0,
        quality_status: 'pending',
        test_date: new Date().toISOString().split('T')[0]
      });
    }
  }, [productQuality, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = {
        ...formData,
        test_date: new Date(formData.test_date).toISOString()
      };

      if (productQuality) {
        await updateMutation.mutateAsync({
          id: productQuality.id,
          ...dataToSubmit
        });
      } else {
        await createMutation.mutateAsync(dataToSubmit);
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {productQuality ? 'Modifier le test qualité' : 'Ajouter un test qualité'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product_name">Nom du produit</Label>
            <Input
              id="product_name"
              value={formData.product_name}
              onChange={(e) => setFormData({...formData, product_name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="batch_number">Numéro de lot</Label>
            <Input
              id="batch_number"
              value={formData.batch_number}
              onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="test_date">Date du test</Label>
            <Input
              id="test_date"
              type="date"
              value={formData.test_date}
              onChange={(e) => setFormData({...formData, test_date: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="density">Densité</Label>
            <Input
              id="density"
              type="number"
              step="0.0001"
              value={formData.density}
              onChange={(e) => setFormData({...formData, density: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="viscosity">Viscosité</Label>
            <Input
              id="viscosity"
              type="number"
              step="0.1"
              value={formData.viscosity}
              onChange={(e) => setFormData({...formData, viscosity: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="sulfur_content">Teneur en soufre</Label>
            <Input
              id="sulfur_content"
              type="number"
              step="0.001"
              value={formData.sulfur_content}
              onChange={(e) => setFormData({...formData, sulfur_content: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="octane_rating">Indice d'octane</Label>
            <Input
              id="octane_rating"
              type="number"
              step="0.1"
              value={formData.octane_rating}
              onChange={(e) => setFormData({...formData, octane_rating: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="quality_status">Statut qualité</Label>
            <Select 
              value={formData.quality_status} 
              onValueChange={(value) => setFormData({...formData, quality_status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="conforming">Conforme</SelectItem>
                <SelectItem value="non_conforming">Non conforme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {productQuality ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
