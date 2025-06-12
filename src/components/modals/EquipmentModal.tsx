
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { useCreateEquipmentData, useUpdateEquipmentData } from '@/hooks/useEquipmentData';
import { Tables } from '@/integrations/supabase/types';

type EquipmentData = Tables<'equipment_data'>;

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: EquipmentData;
}

export function EquipmentModal({ isOpen, onClose, equipment }: EquipmentModalProps) {
  const [formData, setFormData] = useState({
    equipment_id: '',
    equipment_name: '',
    equipment_type: '',
    status: 'operational',
    location: '',
    efficiency_percentage: 0,
    operating_hours: 0
  });

  const createMutation = useCreateEquipmentData();
  const updateMutation = useUpdateEquipmentData();

  useEffect(() => {
    if (equipment) {
      setFormData({
        equipment_id: equipment.equipment_id,
        equipment_name: equipment.equipment_name,
        equipment_type: equipment.equipment_type,
        status: equipment.status,
        location: equipment.location || '',
        efficiency_percentage: equipment.efficiency_percentage || 0,
        operating_hours: equipment.operating_hours || 0
      });
    } else {
      setFormData({
        equipment_id: '',
        equipment_name: '',
        equipment_type: '',
        status: 'operational',
        location: '',
        efficiency_percentage: 0,
        operating_hours: 0
      });
    }
  }, [equipment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (equipment) {
        await updateMutation.mutateAsync({
          id: equipment.id,
          ...formData
        });
      } else {
        await createMutation.mutateAsync(formData);
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
            {equipment ? 'Modifier l\'équipement' : 'Ajouter un équipement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="equipment_id">ID Équipement</Label>
            <Input
              id="equipment_id"
              value={formData.equipment_id}
              onChange={(e) => setFormData({...formData, equipment_id: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="equipment_name">Nom</Label>
            <Input
              id="equipment_name"
              value={formData.equipment_name}
              onChange={(e) => setFormData({...formData, equipment_name: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="equipment_type">Type</Label>
            <Select 
              value={formData.equipment_type} 
              onValueChange={(value) => setFormData({...formData, equipment_type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pompe">Pompe</SelectItem>
                <SelectItem value="compresseur">Compresseur</SelectItem>
                <SelectItem value="echangeur">Échangeur</SelectItem>
                <SelectItem value="reacteur">Réacteur</SelectItem>
                <SelectItem value="colonne">Colonne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({...formData, status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Opérationnel</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="alarm">Alarme</SelectItem>
                <SelectItem value="stopped">Arrêté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="efficiency_percentage">Efficacité (%)</Label>
            <Input
              id="efficiency_percentage"
              type="number"
              step="0.1"
              value={formData.efficiency_percentage}
              onChange={(e) => setFormData({...formData, efficiency_percentage: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="operating_hours">Heures de fonctionnement</Label>
            <Input
              id="operating_hours"
              type="number"
              value={formData.operating_hours}
              onChange={(e) => setFormData({...formData, operating_hours: parseFloat(e.target.value)})}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {equipment ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
