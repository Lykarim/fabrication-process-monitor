
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateEquipmentData, useUpdateEquipmentData } from '@/hooks/useEquipmentData';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface EquipmentFormProps {
  data?: Tables<'equipment_data'>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EquipmentForm({ data, onSuccess, onCancel }: EquipmentFormProps) {
  const [formData, setFormData] = useState({
    equipment_id: data?.equipment_id || '',
    equipment_name: data?.equipment_name || '',
    equipment_type: data?.equipment_type || '',
    status: data?.status || 'operational',
    location: data?.location || '',
    efficiency_percentage: data?.efficiency_percentage?.toString() || '',
    operating_hours: data?.operating_hours?.toString() || '',
    last_maintenance: data?.last_maintenance ? new Date(data.last_maintenance).toISOString().slice(0, 16) : '',
    next_maintenance: data?.next_maintenance ? new Date(data.next_maintenance).toISOString().slice(0, 16) : '',
  });

  const createMutation = useCreateEquipmentData();
  const updateMutation = useUpdateEquipmentData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      equipment_id: formData.equipment_id,
      equipment_name: formData.equipment_name,
      equipment_type: formData.equipment_type,
      status: formData.status as 'operational' | 'maintenance' | 'stopped' | 'alarm',
      location: formData.location || null,
      efficiency_percentage: formData.efficiency_percentage ? parseFloat(formData.efficiency_percentage) : null,
      operating_hours: formData.operating_hours ? parseFloat(formData.operating_hours) : null,
      last_maintenance: formData.last_maintenance || null,
      next_maintenance: formData.next_maintenance || null,
    };

    try {
      if (data?.id) {
        await updateMutation.mutateAsync({ ...submitData, id: data.id });
        toast.success('Équipement mis à jour avec succès');
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success('Équipement créé avec succès');
      }
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data ? 'Modifier' : 'Ajouter'} un équipement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="equipment_id">Tag équipement</Label>
              <Input
                id="equipment_id"
                value={formData.equipment_id}
                onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="equipment_name">Nom de l'équipement</Label>
              <Input
                id="equipment_name"
                value={formData.equipment_name}
                onChange={(e) => setFormData({ ...formData, equipment_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="equipment_type">Type d'équipement</Label>
              <Select value={formData.equipment_type} onValueChange={(value) => setFormData({ ...formData, equipment_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pompe">Pompe</SelectItem>
                  <SelectItem value="compresseur">Compresseur</SelectItem>
                  <SelectItem value="echangeur">Échangeur</SelectItem>
                  <SelectItem value="colonne">Colonne</SelectItem>
                  <SelectItem value="reacteur">Réacteur</SelectItem>
                  <SelectItem value="chaudiere">Chaudière</SelectItem>
                  <SelectItem value="turbine">Turbine</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Opérationnel</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="stopped">Arrêté</SelectItem>
                  <SelectItem value="alarm">Alarme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="efficiency_percentage">Efficacité (%)</Label>
              <Input
                id="efficiency_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.efficiency_percentage}
                onChange={(e) => setFormData({ ...formData, efficiency_percentage: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="operating_hours">Heures de fonctionnement</Label>
            <Input
              id="operating_hours"
              type="number"
              step="0.01"
              min="0"
              value={formData.operating_hours}
              onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="last_maintenance">Dernière maintenance</Label>
              <Input
                id="last_maintenance"
                type="datetime-local"
                value={formData.last_maintenance}
                onChange={(e) => setFormData({ ...formData, last_maintenance: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="next_maintenance">Prochaine maintenance</Label>
              <Input
                id="next_maintenance"
                type="datetime-local"
                value={formData.next_maintenance}
                onChange={(e) => setFormData({ ...formData, next_maintenance: e.target.value })}
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
