
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { useCreateWaterTreatmentData, useUpdateWaterTreatmentData } from '@/hooks/useWaterTreatmentData';
import { Tables } from '@/integrations/supabase/types';

type WaterTreatmentData = Tables<'water_treatment_data'>;

interface WaterTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  waterTreatment?: WaterTreatmentData;
}

export function WaterTreatmentModal({ isOpen, onClose, waterTreatment }: WaterTreatmentModalProps) {
  const [formData, setFormData] = useState({
    equipment_name: '',
    ph_level: 7.0,
    temperature: 25.0,
    pressure: 3.0,
    flow_rate: 100.0,
    status: 'normal'
  });

  const createMutation = useCreateWaterTreatmentData();
  const updateMutation = useUpdateWaterTreatmentData();

  useEffect(() => {
    if (waterTreatment) {
      setFormData({
        equipment_name: waterTreatment.equipment_name,
        ph_level: waterTreatment.ph_level || 7.0,
        temperature: waterTreatment.temperature || 25.0,
        pressure: waterTreatment.pressure || 3.0,
        flow_rate: waterTreatment.flow_rate || 100.0,
        status: waterTreatment.status || 'normal'
      });
    } else {
      setFormData({
        equipment_name: '',
        ph_level: 7.0,
        temperature: 25.0,
        pressure: 3.0,
        flow_rate: 100.0,
        status: 'normal'
      });
    }
  }, [waterTreatment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (waterTreatment) {
        await updateMutation.mutateAsync({
          id: waterTreatment.id,
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
            {waterTreatment ? 'Modifier la mesure' : 'Ajouter une mesure'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="equipment_name">Nom de l'équipement</Label>
            <Input
              id="equipment_name"
              value={formData.equipment_name}
              onChange={(e) => setFormData({...formData, equipment_name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="ph_level">pH</Label>
            <Input
              id="ph_level"
              type="number"
              step="0.1"
              value={formData.ph_level}
              onChange={(e) => setFormData({...formData, ph_level: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="temperature">Température (°C)</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="pressure">Pression (bar)</Label>
            <Input
              id="pressure"
              type="number"
              step="0.1"
              value={formData.pressure}
              onChange={(e) => setFormData({...formData, pressure: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="flow_rate">Débit (L/min)</Label>
            <Input
              id="flow_rate"
              type="number"
              step="0.1"
              value={formData.flow_rate}
              onChange={(e) => setFormData({...formData, flow_rate: parseFloat(e.target.value)})}
            />
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
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="warning">Attention</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {waterTreatment ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
