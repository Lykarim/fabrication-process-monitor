
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateProductQualityData, useUpdateProductQualityData } from '@/hooks/useProductQualityData';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface ProductQualityFormProps {
  data?: Tables<'product_quality_data'>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductQualityForm({ data, onSuccess, onCancel }: ProductQualityFormProps) {
  const [formData, setFormData] = useState({
    product_name: data?.product_name || '',
    batch_number: data?.batch_number || '',
    density: data?.density?.toString() || '',
    viscosity: data?.viscosity?.toString() || '',
    sulfur_content: data?.sulfur_content?.toString() || '',
    octane_rating: data?.octane_rating?.toString() || '',
    quality_status: data?.quality_status || 'pending',
    test_date: data?.test_date ? new Date(data.test_date).toISOString().slice(0, 16) : '',
  });

  const createMutation = useCreateProductQualityData();
  const updateMutation = useUpdateProductQualityData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      product_name: formData.product_name,
      batch_number: formData.batch_number,
      density: formData.density ? parseFloat(formData.density) : null,
      viscosity: formData.viscosity ? parseFloat(formData.viscosity) : null,
      sulfur_content: formData.sulfur_content ? parseFloat(formData.sulfur_content) : null,
      octane_rating: formData.octane_rating ? parseFloat(formData.octane_rating) : null,
      quality_status: formData.quality_status as 'conforming' | 'non_conforming' | 'pending',
      test_date: formData.test_date,
    };

    try {
      if (data?.id) {
        await updateMutation.mutateAsync({ ...submitData, id: data.id });
        toast.success('Données mises à jour avec succès');
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success('Données créées avec succès');
      }
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data ? 'Modifier' : 'Ajouter'} des données de qualité produit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product_name">Nom du produit</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="batch_number">Numéro de lot</Label>
              <Input
                id="batch_number"
                value={formData.batch_number}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="density">Densité</Label>
              <Input
                id="density"
                type="number"
                step="0.0001"
                value={formData.density}
                onChange={(e) => setFormData({ ...formData, density: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="viscosity">Viscosité</Label>
              <Input
                id="viscosity"
                type="number"
                step="0.0001"
                value={formData.viscosity}
                onChange={(e) => setFormData({ ...formData, viscosity: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sulfur_content">Teneur en soufre</Label>
              <Input
                id="sulfur_content"
                type="number"
                step="0.0001"
                value={formData.sulfur_content}
                onChange={(e) => setFormData({ ...formData, sulfur_content: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="octane_rating">Indice d'octane</Label>
              <Input
                id="octane_rating"
                type="number"
                step="0.01"
                value={formData.octane_rating}
                onChange={(e) => setFormData({ ...formData, octane_rating: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quality_status">Statut qualité</Label>
              <Select value={formData.quality_status} onValueChange={(value) => setFormData({ ...formData, quality_status: value })}>
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
            <div>
              <Label htmlFor="test_date">Date de test</Label>
              <Input
                id="test_date"
                type="datetime-local"
                value={formData.test_date}
                onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {data ? 'Mettre à jour' : 'Créer'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
